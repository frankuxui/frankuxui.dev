# Etapa 1: construir la app
FROM node:22-alpine AS builder

# Crea y entra a la carpeta de la app
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY . .

# Instala dependencias
RUN npm ci

# Construye el sitio Astro en modo producción
RUN npm run build

# Etapa 2: servidor de producción
FROM node:22-alpine AS runner

WORKDIR /app

# Copia solo lo necesario del build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instala solo dependencias necesarias para ejecutar Astro
RUN npm ci --omit=dev

# Puerto configurado en tu package.json (4312)
ENV PORT=4312
ENV NODE_ENV=production

EXPOSE 4312

# Comando de inicio: Astro preview (Node adapter)
CMD ["npm", "run", "preview"]
