# --- Build Stage ---
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm install && npm run build

# --- Serve Stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

# Nginx default serves on port 80, so config override is needed for port 3000
RUN sed -i 's/listen       80;/listen       3000;/g' /etc/nginx/conf.d/default.conf
