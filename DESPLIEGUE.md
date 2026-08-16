# Despliegue de frankuxui.dev

Documentación del despliegue a producción de este proyecto (Astro + adapter `@astrojs/node`, modo `standalone`). Empezó el 2026-08-16 y pasó por varias iteraciones el mismo día — este documento describe **el estado actual primero**, y deja el historial completo más abajo porque contiene diagnósticos que probablemente vuelvan a ser útiles.

## Arquitectura actual: PM2

- **App**: Astro (`output: 'server'`, `adapter: node({ mode: 'standalone' })`), definido en `astro.config.ts`.
- **Runtime**: proceso PM2 (`frankuxui.dev`, modo fork), arrancado con `pm2 start ecosystem.config.cjs`. Corre `npm run preview` (= `astro preview --port 4312 --host`), escuchando en `0.0.0.0:4312`.
- **Proxy inverso**: Traefik (contenedor `traefik`) enruta `frankuxui.dev` hacia `http://172.17.0.1:4312` (IP del bridge `docker0`, alcanza al proceso en el host).
- **Firewall (`ufw`)**: regla `4312/tcp ALLOW IN 172.18.0.0/16` — **imprescindible**, sin ella Traefik no llega al proceso aunque este esté sano. La subred correcta es la de la red Docker `proxy` (`172.18.0.0/16`, donde vive el contenedor de Traefik), no la del bridge `docker0` (`172.17.0.0/16`) — ver el incidente de más abajo, es un error fácil de repetir.
- **Variables de entorno**: fichero `.env` en la raíz del proyecto (no versionado). `astro preview` **no lo carga solo**, así que se usa `ecosystem.config.cjs` (parsea `.env` con `dotenv` y lo inyecta en el `env` de PM2 — ver detalle en el incidente correspondiente más abajo).

```
Internet → Cloudflare → Traefik (80/443, contenedor, red "proxy") → 172.17.0.1:4312 (host) → PM2 → astro preview
```

Nota: `frankuxui.com` (Next.js) corre igual, vía pm2 en el host, puerto `3012`, Traefik lo alcanza por `http://host.docker.internal:3012`. `n8n` corre como contenedor en la red `proxy` (`http://n8n:5678`). Ver `/srv/apps/AGENTS.md` para el mapa completo de los tres proyectos.

## Variables de entorno (`.env`)

Ubicado en `/srv/apps/frankuxui.dev/.env` (no está en git). Contenido actual:

```env
BASE_URL=https://frankuxui.dev
N8N_CONTACT_WEBHOOK_URL=https://n8n.frankuxui.dev/webhook/contact
N8N_FEEDBACK_WEBHOOK_URL=https://n8n.frankuxui.dev/webhook/4b3a00f5-c852-4fb3-8b11-c343f9b19dcb
```

Usadas por los formularios de contacto y feedback del sitio (webhooks de n8n). Si faltan, la app arranca igual pero esos formularios fallan silenciosamente (sin error visible al usuario, el webhook nunca se dispara).

## `ecosystem.config.cjs`

```js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const env = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};

module.exports = {
  apps: [
    {
      name: 'frankuxui.dev',
      script: 'npm',
      args: 'run preview',
      cwd: __dirname,
      env,
    },
  ],
};
```

**Por qué existe**: `pm2 start npm --name "frankuxui.dev" -- run preview` (el comando "directo", sin este fichero) deja el proceso sin las variables del `.env` — se comprobó leyendo `/proc/<pid>/environ` del proceso real y no aparecían `N8N_CONTACT_WEBHOOK_URL` ni las demás. `astro preview` no hace ningún `dotenv.config()` automático que las inyecte en `process.env` (a diferencia de `astro dev`/`astro build`, que sí resuelven `.env` para `import.meta.env`, pero las variables `astro:env` de contexto `server`/`secret` se leen de `process.env` en tiempo real). Por eso hace falta este wrapper: PM2 sí soporta pasar un objeto `env` completo, y ahí se le da el contenido del `.env` ya parseado.

**Siempre arrancar con** `pm2 start ecosystem.config.cjs`, nunca con el comando `pm2 start npm ...` directo — este último "funciona" (el sitio carga) pero deja los formularios rotos sin ningún error visible.

## Cómo desplegar (flujo normal)

```bash
cd /srv/apps/frankuxui.dev
git pull origin main
npm install
npm run build
pm2 restart frankuxui.dev

# Verificar
curl -s -o /dev/null -w "%{http_code}\n" https://frankuxui.dev/   # debe dar 200
pm2 logs frankuxui.dev --lines 30 --nostream
```

Si el proceso no existe (primer arranque, o se borró): `pm2 start ecosystem.config.cjs && pm2 save`.

No hace falta tocar Traefik ni el firewall en despliegues normales — ya están configurados para este puerto.

## Incidente 3: vuelta a PM2 y el error de subred en `ufw`

**Contexto**: tras tener el sitio funcionando en Docker (ver Incidente 1 más abajo), se pidió explícitamente volver a PM2, replicando el comando que se usaba originalmente: `pm2 start npm --name "frankuxui.dev" -- run preview`.

**Problema 1 — env vars perdidas**: ese comando deja el proceso sin `.env` cargado (ver sección de `ecosystem.config.cjs` arriba). Se resolvió recreando `ecosystem.config.cjs` (se había borrado durante la migración a Docker) apuntando a `npm run preview` en vez del entrypoint standalone.

**Problema 2 — subred equivocada en la regla de `ufw`**: al pedir abrir el puerto `4312` para que Traefik llegara al proceso, la primera regla se creó así:

```bash
sudo ufw allow from 172.17.0.0/16 to any port 4312 proto tcp   # INCORRECTO
```

Esto no funcionó (`nc` desde el contenedor de Traefik seguía dando timeout). El motivo: se asumió que el tráfico entrante vendría "desde" `172.17.0.1` (la IP de destino que usa Traefik para llegar al host, el gateway del bridge `docker0`), pero **el filtro de `ufw` es por IP de origen del paquete**, y el origen es la IP propia del contenedor de Traefik en su red real, `proxy` (`172.18.0.0/16` — se confirmó mirando la regla ya existente y funcional del puerto `3012`, que usa esa misma subred). Fix:

```bash
sudo ufw delete allow from 172.17.0.0/16 to any port 4312 proto tcp
sudo ufw allow from 172.18.0.0/16 to any port 4312 proto tcp   # CORRECTO
```

Tras esto, `docker exec traefik nc -vz -w5 172.17.0.1 4312` dio `open` y el sitio volvió a responder `200`.

**Lección para cualquier puerto nuevo en este host**: la regla `ufw` siempre debe permitir el origen `172.18.0.0/16` (subred de la red Docker `proxy`), sin importar que el destino se referencie por `172.17.0.1` (bridge `docker0`) — son subredes distintas y `ufw` no las traduce.

**Limpieza tras volver a PM2**: se paró y eliminó el contenedor Docker (`docker stop frankuxui-dev && docker rm frankuxui-dev`). La imagen `frankuxui-dev:latest` y el `Dockerfile` se dejaron intactos por si se necesita revertir a Docker en el futuro (ver Incidente 1). El servicio `astro` en `/srv/infra/traefik/dynamic.yml` se volvió a apuntar a `http://172.17.0.1:4312` (estaba en `http://frankuxui-dev:4321`), con `docker restart traefik` para forzar la recarga.

---

## Incidente 1 (histórico): por qué se dockerizó originalmente

> Esta sección documenta el primer intento de despliegue (PM2 directo) y por qué se migró a Docker. Ya no es la arquitectura activa (ver arriba), pero el diagnóstico sigue siendo válido si se repite el síntoma o se quiere volver a esa opción.

**Síntoma inicial**: proceso Node lanzado directo con pm2 en el host, escuchando en `0.0.0.0:4312`; la web daba `504 Gateway Timeout` en `https://frankuxui.dev`, aunque `curl http://localhost:4312` en el propio host devolvía `200`.

**Diagnóstico**: el problema no era la app ni Traefik. Se probó conectividad TCP pura desde dentro del contenedor `traefik` hacia varios puertos del host (vía `172.17.0.1`, la IP del bridge `docker0`):

```bash
docker exec traefik nc -vz -w2 172.17.0.1 3012   # open (Next.js, sí pasaba)
docker exec traefik nc -vz -w2 172.17.0.1 4312   # timed out (Astro, bloqueado)
```

Conclusión (en su momento, antes de identificar la subred correcta — ver Incidente 3): el firewall del host solo permitía tráfico hacia el puerto `3012`. Un proceso pm2 nuevo en cualquier otro puerto quedaba inalcanzable **sin abrir una regla de firewall nueva**. En vez de tocar el firewall, se optó por Dockerizar la app.

**Decisión de entonces**: meter Astro en un contenedor Docker conectado a la red `proxy` (misma red que `n8n`). El tráfico contenedor-a-contenedor no pasa por las reglas de firewall del host (`INPUT`/`ufw`), así que no hacía falta abrir ningún puerto. También es el patrón de despliegue Docker documentado oficialmente por Astro para el adapter `node`.

### Cómo se desplegaba en Docker (por si se retoma esta vía)

`Dockerfile` (multi-stage, sigue en el repo sin usarse actualmente):

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

Deploy:

```bash
cd /srv/apps/frankuxui.dev
git pull origin main
docker build -t frankuxui-dev:latest .
docker stop frankuxui-dev
docker rm frankuxui-dev
docker run -d \
  --name frankuxui-dev \
  --network proxy \
  --restart unless-stopped \
  --env-file /srv/apps/frankuxui.dev/.env \
  frankuxui-dev:latest
```

Y el servicio en `/srv/infra/traefik/dynamic.yml` apuntando a `http://frankuxui-dev:4321` en vez de `http://172.17.0.1:4312`. Backups de `dynamic.yml` antes de cada cambio quedan en `/srv/infra/traefik/dynamic.yml.bak-<timestamp>`.

---

## Incidente 2: "Cross-site POST form submissions are forbidden" en el formulario de contacto

**Síntoma**: el formulario de `/contacto` (Astro Action `actions.contact`) devolvía `403` con el mensaje `Cross-site POST form submissions are forbidden` al enviarlo desde el navegador. Ocurrió con la app corriendo en Docker, pero la causa es independiente del mecanismo (Docker o PM2) — sigue aplicando ahora.

**Causa**: Astro Actions valida por defecto (`security.checkOrigin`, `true` por defecto) que la cabecera `Origin` de cada `POST` coincida con el origen que Astro calcula internamente para la request. El adapter `@astrojs/node` (v11.0.2) calcula ese origen mirando `req.socket.encrypted` — **no lee `X-Forwarded-Proto`** — así que detrás de Traefik (que termina el TLS) Astro ve `http://frankuxui.dev` mientras el navegador manda `Origin: https://frankuxui.dev`. Mismatch → 403, en toda request `POST`/`PATCH`/`PUT`/`DELETE` con body tipo formulario, sin importar que la petición fuera legítima.

Diagnóstico rápido para reproducirlo:

```bash
curl -s -X POST https://frankuxui.dev/_actions/contact \
  -H "Origin: https://frankuxui.dev" -F "name=Test"
# antes del fix: 403 "Cross-site POST form submissions are forbidden"
# después del fix: 400 con detalle de validación Zod (el 403 desaparece)
```

**Fix**: en `astro.config.ts`, dentro de `defineConfig`:

```ts
// @astrojs/node doesn't honor X-Forwarded-Proto, so behind Traefik (TLS terminated there)
// it sees http:// while the browser sends an https:// Origin, tripping the CSRF check.
security: {
	checkOrigin: false,
},
```

Es el propio escenario que la documentación de Astro (`security.checkOrigin`) cita como caso válido para desactivarlo: "tu app corre detrás de un proxy reverso de confianza que manipula las cabeceras de origen". Desactivarlo quita la protección CSRF nativa de Astro Actions para ese check concreto; no se tocó CSS ni ningún otro estilo.

**Nota para el admin**: si en el futuro se migra a otro adapter de Astro (o a una versión de `@astrojs/node` que sí soporte cabeceras `X-Forwarded-*`), revisar si conviene volver a activar `checkOrigin: true`.

## Comandos útiles

```bash
pm2 status frankuxui.dev                          # estado
pm2 logs frankuxui.dev --lines 50                  # logs en vivo
pm2 restart frankuxui.dev                          # reinicio (usa el ecosystem.config.cjs ya cargado)
ss -tlnp | grep 4312                               # confirmar que escucha en el host
docker exec traefik nc -vz -w5 172.17.0.1 4312     # confirmar que Traefik alcanza el proceso
```

## Pendientes / notas para el admin del servidor

- Regla `ufw` activa: `4312/tcp ALLOW IN 172.18.0.0/16`. Si se reinstala el firewall o se resetea `ufw`, hay que volver a crearla (con la subred correcta, `172.18.0.0/16`, no `172.17.0.0/16`).
- La imagen Docker `frankuxui-dev:latest` ya no existe en este host (se eliminó junto con el contenedor). El `Dockerfile` sigue en el repo si se quiere reconstruir.
- El backup de `dynamic.yml` previo a cada cambio queda en `/srv/infra/traefik/dynamic.yml.bak-<timestamp>` por si hay que revertir.
