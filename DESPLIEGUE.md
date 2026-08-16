# Despliegue de frankuxui.dev

Documentación del despliegue a producción de este proyecto (Astro + adapter `@astrojs/node`, modo `standalone`), realizado el 2026-08-16.

## Arquitectura actual

- **App**: Astro (`output: 'server'`, `adapter: node({ mode: 'standalone' })`), definido en `astro.config.ts`.
- **Runtime**: contenedor Docker `frankuxui-dev`, construido desde el `Dockerfile` de este repo.
- **Red Docker**: el contenedor está conectado a la red `proxy` (la misma red donde vive `n8n`), NO publica ningún puerto al host.
- **Proxy inverso**: Traefik (contenedor `traefik`), que enruta `frankuxui.dev` hacia el contenedor por nombre: `http://frankuxui-dev:4321`.
- **Variables de entorno**: fichero `.env` en la raíz del proyecto (no versionado), cargado al contenedor con `--env-file .env` al arrancarlo.

```
Internet → Cloudflare → Traefik (80/443, contenedor) → red docker "proxy" → frankuxui-dev:4321 (contenedor Astro)
```

Nota: el sitio hermano `frankuxui.com` (Next.js) sigue corriendo vía pm2 en el host y Traefik lo alcanza por `http://host.docker.internal:3012`. `n8n` corre como contenedor en la misma red `proxy` (`http://n8n:5678`). Son tres mecanismos distintos conviviendo en el mismo Traefik — ver sección "Por qué se dockerizó" para el motivo de que Astro no siga el mismo patrón que `frankuxui.com`.

## Variables de entorno (`.env`)

Ubicado en `/srv/apps/frankuxui.dev/.env` (no está en git). Contenido actual:

```env
BASE_URL=https://frankuxui.dev
N8N_CONTACT_WEBHOOK_URL=https://n8n.frankuxui.dev/webhook/contact
N8N_FEEDBACK_WEBHOOK_URL=https://n8n.frankuxui.dev/webhook/4b3a00f5-c852-4fb3-8b11-c343f9b19dcb
```

Usadas por los formularios de contacto y feedback del sitio (webhooks de n8n). Si faltan, la app arranca igual pero esos formularios fallan.

## Cómo desplegar (flujo normal, a partir de ahora)

```bash
cd /srv/apps/frankuxui.dev

# 1. Traer los últimos cambios de main
git pull origin main

# 2. Instalar dependencias (si cambió package.json/lock)
npm install

# 3. Reconstruir la imagen Docker (el build de Astro ocurre DENTRO del Dockerfile)
docker build -t frankuxui-dev:latest .

# 4. Reemplazar el contenedor en marcha por la nueva imagen
docker stop frankuxui-dev
docker rm frankuxui-dev
docker run -d \
  --name frankuxui-dev \
  --network proxy \
  --restart unless-stopped \
  --env-file /srv/apps/frankuxui.dev/.env \
  frankuxui-dev:latest

# 5. Verificar
curl -s -o /dev/null -w "%{http_code}\n" https://frankuxui.dev/   # debe dar 200
docker logs frankuxui-dev --tail 30
```

El `npm install` del paso 2 en el host es opcional para el propio despliegue (el `Dockerfile` hace su propio `npm ci` dentro de la imagen), pero conviene mantenerlo sincronizado en el host para desarrollo local (`npm run dev`, editor, etc).

No hace falta tocar Traefik en despliegues normales — `dynamic.yml` ya apunta al nombre del contenedor (`frankuxui-dev`), y Docker resuelve ese nombre a la IP interna que le toque en cada arranque.

## `Dockerfile` (nuevo, creado en este despliegue)

Build multi-stage: una fase compila con Astro (`npm ci` + `npm run build`), la otra instala solo dependencias de producción y copia `dist/`.

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

También se creó `.dockerignore` (excluye `node_modules`, `dist`, `.git`, `.env`).

`HOST=0.0.0.0` y `PORT=4321` son las variables que lee el adapter `@astrojs/node` en modo `standalone` en tiempo de ejecución (documentación oficial de Astro).

## Cambios en infraestructura compartida (Traefik)

Fichero: `/srv/infra/traefik/dynamic.yml` (afecta también a `frankuxui.com` y `n8n`, que comparten el mismo Traefik).

Antes de tocarlo se hizo una copia de seguridad: `/srv/infra/traefik/dynamic.yml.bak-<timestamp>`.

**Cambio único**, en el servicio `astro`:

```diff
   services:
     astro:
       loadBalancer:
         servers:
-          - url: "http://172.17.0.1:4312"
+          - url: "http://frankuxui-dev:4321"
         passHostHeader: true
```

Traefik tiene `watch: true` sobre `dynamic.yml` (en `traefik.yml`), así que en teoría recarga solo. En la práctica, tras editar el fichero la web seguía dando 504 hasta hacer `docker restart traefik`; si vuelves a tocar este fichero y no coge el cambio, reinicia el contenedor manualmente:

```bash
docker restart traefik
```

## Por qué se dockerizó (diagnóstico del incidente)

**Síntoma inicial**: tras el primer despliegue (proceso Node lanzado directo con pm2 en el host, escuchando en `0.0.0.0:4312`), la web daba `504 Gateway Timeout` en `https://frankuxui.dev`, aunque `curl http://localhost:4312` en el propio host devolvía `200`.

**Diagnóstico**: el problema no era la app ni Traefik. Se probó conectividad TCP pura desde dentro del contenedor `traefik` hacia varios puertos del host (vía `172.17.0.1`, la IP del bridge `docker0`):

```bash
docker exec traefik nc -vz -w2 172.17.0.1 3012   # open (Next.js, sí pasaba)
docker exec traefik nc -vz -w2 172.17.0.1 4312   # timed out (Astro, bloqueado)
docker exec traefik nc -vz -w2 172.17.0.1 4321   # timed out
docker exec traefik nc -vz -w2 172.17.0.1 8080   # timed out
```

Conclusión: el firewall del host (ufw/iptables) solo permite tráfico entrante desde la red Docker hacia el puerto `3012` (el único que ya estaba dado de alta para `frankuxui.com`). Cualquier otro puerto del host queda filtrado (timeout, no "connection refused"), así que un proceso pm2 nuevo en el host NUNCA iba a ser alcanzable por Traefik sin abrir puerto en el firewall.

**Decisión**: en vez de abrir un puerto nuevo en el firewall (host), se metió Astro en un contenedor Docker conectado a la misma red `proxy` que ya usa `n8n`. El tráfico contenedor-a-contenedor dentro de una red Docker definida por el usuario no pasa por las reglas de firewall del host (`INPUT`/`ufw`), así que no hizo falta abrir ningún puerto. Esto también es el patrón de despliegue Docker documentado oficialmente por Astro para el adapter `node`.

Se probó explícitamente esta conectividad antes de dar el cambio por bueno:

```bash
docker exec traefik nc -vz -w5 frankuxui-dev 4321       # open
docker exec traefik wget -qO- http://frankuxui-dev:4321/ # 200 OK
```

## Limpieza tras la migración

El proceso pm2 original (`frankuxui.dev`, lanzando `dist/server/entry.mjs` en el host) quedó redundante una vez el contenedor funcionaba, y se eliminó:

```bash
pm2 stop frankuxui.dev
pm2 delete frankuxui.dev
pm2 save
```

También se creó y luego se descartó (a favor de esta solución) un `ecosystem.config.cjs` que intentaba resolver la carga de variables de entorno en pm2 vía `dotenv`. Ya se eliminó del repo — pm2 ya no gestiona este proyecto.

`frankuxui.com` (Next.js) sigue vivo en pm2 en el host, sin cambios — no se tocó.

## Incidente: "Cross-site POST form submissions are forbidden" en el formulario de contacto

**Síntoma**: tras el despliegue en Docker, el formulario de `/contacto` (Astro Action `actions.contact`) devolvía `403` con el mensaje `Cross-site POST form submissions are forbidden` al enviarlo desde el navegador.

**Causa**: Astro Actions valida por defecto (`security.checkOrigin`, `true` por defecto) que la cabecera `Origin` de cada `POST` coincida con el origen que Astro calcula internamente para la request. El adapter `@astrojs/node` (v11.0.2) calcula ese origen mirando `req.socket.encrypted` — **no lee `X-Forwarded-Proto`** — así que dentro del contenedor la conexión (Traefik → app) es HTTP plano y Astro construye `http://frankuxui.dev`, mientras el navegador manda `Origin: https://frankuxui.dev`. Mismatch → 403, en toda request `POST`/`PATCH`/`PUT`/`DELETE` con body tipo formulario, sin importar que la petición fuera legítima.

Diagnóstico rápido para reproducirlo:

```bash
curl -s -X POST https://frankuxui.dev/_actions/contact \
  -H "Origin: https://frankuxui.dev" -F "name=Test"
# antes del fix: 403 "Cross-site POST form submissions are forbidden"
# después del fix: 400 con detalle de validación Zod (el 403 desaparece)
```

**Fix**: en `astro.config.ts`, dentro de `defineConfig`, se añadió:

```ts
// @astrojs/node doesn't honor X-Forwarded-Proto, so behind Traefik (TLS terminated there)
// it sees http:// while the browser sends an https:// Origin, tripping the CSRF check.
security: {
	checkOrigin: false,
},
```

Es el propio escenario que la documentación de Astro (`security.checkOrigin`) cita como caso válido para desactivarlo: "tu app corre detrás de un proxy reverso de confianza que manipula las cabeceras de origen" — que es exactamente nuestro caso con Traefik. Desactivarlo quita la protección CSRF nativa de Astro Actions para ese check concreto; no se tocó CSS ni ningún otro estilo.

Se aplicó reconstruyendo la imagen y redesplegando el contenedor con el mismo flujo de la sección "Cómo desplegar" de arriba.

**Nota para el admin**: si en el futuro se migra a otro adapter de Astro (o a una versión de `@astrojs/node` que sí soporte cabeceras `X-Forwarded-*`), revisar si conviene volver a activar `checkOrigin: true`.

## Comandos útiles para operar el contenedor

```bash
docker ps --filter name=frankuxui-dev          # estado
docker logs frankuxui-dev --tail 50 -f          # logs en vivo
docker restart frankuxui-dev                    # reinicio sin rebuild
docker exec frankuxui-dev sh -c 'env | grep N8N' # comprobar env vars cargadas
```

## Pendientes / notas para el admin del servidor

- Si en algún momento se quiere volver a exponer la app directamente por puerto de host (fuera de Docker), habrá que abrir el puerto correspondiente en el firewall — no está abierto ningún puerto nuevo por este despliegue, todo quedó dentro de la red `proxy`.
- La imagen `frankuxui-dev:latest` no está en ningún registry remoto, solo existe localmente en este servidor (`docker images | grep frankuxui-dev`). Si se reinstala el servidor, hay que reconstruirla desde este repo.
- El backup de `dynamic.yml` previo al cambio queda en `/srv/infra/traefik/dynamic.yml.bak-<timestamp>` por si hay que revertir.
