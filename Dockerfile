FROM node:20-bullseye

WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3083

RUN npm run build
