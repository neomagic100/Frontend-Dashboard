FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM ubuntu/apache2

EXPOSE 80

COPY --from=build /app/dist /var/www/html


