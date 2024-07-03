# Stage 1 - the build process
FROM node:20-alpine as build-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.25.5-alpine
COPY --from=build-deps /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]