# =======================================================
# Dockerfile - AUY1102 Pipeline Parcial 3
# Estudiante: Abraham Ravelo (Parte 1: Docker y CI/CD)
# Asignatura: AUY1102 - Ciclo de vida del Software I
# =======================================================

# Remediación Parte 2 (Simón Lagos): node:18-alpine (sin soporte, con CVEs
# critical/high detectados por Docker Scout) -> node:22-alpine (LTS).

# Etapa 1: Base de construcción y dependencias completas
FROM node:22-alpine AS builder

# Actualizar paquetes del sistema Alpine para aplicar parches de seguridad
RUN apk upgrade --no-cache

WORKDIR /usr/src/app
ENV CI=true

# Copiar archivos de dependencias y configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY jest.config.js ./

# Instalar todas las dependencias (incluyendo devDependencies para build y tests)
RUN npm ci --ignore-scripts

# Copiar código fuente y pruebas unitarias
COPY src/ ./src/
COPY test/ ./test/

# Compilar TypeScript a JavaScript (genera carpeta dist/)
RUN npm run build

# Etapa 2: Entorno para ejecución de pruebas unitarias dentro del contenedor
FROM builder AS test
ENV CI=true
WORKDIR /usr/src/app
ENV CI=true
CMD ["npm", "run", "test:unit"]

# Etapa 3: Imagen final optimizada para producción (Publicación en Docker Hub)
FROM node:22-alpine AS production

# Actualizar paquetes del sistema Alpine para aplicar parches de seguridad
RUN apk upgrade --no-cache && \
    apk add --no-cache --upgrade musl musl-utils --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main

WORKDIR /usr/src/app
ENV CI=true
ENV NODE_ENV=production

# Copiar manifiesto de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción para minimizar tamaño y vulnerabilidades
RUN npm ci --omit=dev --ignore-scripts

# Copiar artefactos compilados desde la etapa builder
COPY --from=builder /usr/src/app/dist ./dist

# Eliminar npm/npx: no se usan en tiempo de ejecución y Docker Scout reporta
# CVEs en las dependencias que trae el npm incluido en la imagen base.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Buena práctica de seguridad / ética: usar usuario sin privilegios root
USER node

EXPOSE 3000

# Comando por defecto de ejecución
CMD ["node", "dist/index.js"]
