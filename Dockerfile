# =======================================================
# Dockerfile - AUY1102 Pipeline Parcial 3
# Estudiante: Abraham Ravelo (Parte 1: Docker y CI/CD)
# Asignatura: AUY1102 - Ciclo de vida del Software I
# =======================================================

# Etapa 1: Base de construcción y dependencias completas
FROM node:18-alpine AS builder

WORKDIR /usr/src/app
ENV CI=true

# Copiar archivos de dependencias y configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY jest.config.js ./

# Instalar todas las dependencias (incluyendo devDependencies para build y tests)
RUN npm ci || npm install

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
FROM node:18-alpine AS production

WORKDIR /usr/src/app
ENV CI=true
ENV NODE_ENV=production

# Copiar manifiesto de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción para minimizar tamaño y vulnerabilidades
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev --ignore-scripts

# Copiar artefactos compilados desde la etapa builder
COPY --from=builder /usr/src/app/dist ./dist

# Buena práctica de seguridad / ética: usar usuario sin privilegios root
USER node

EXPOSE 3000

# Comando por defecto de ejecución
CMD ["node", "dist/index.js"]
