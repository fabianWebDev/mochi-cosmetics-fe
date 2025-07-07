# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copia archivos de build al HTML root de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: reemplazá nginx.conf si querés configurar rutas o cache
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
