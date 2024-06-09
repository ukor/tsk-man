FROM node:20-bullseye

WORKDIR /srv/app

COPY package*.json ./

RUN npm ci

RUN npm i -g @nestjs/cli

RUN npm install turbo --global

COPY turbo.json turbo.json

COPY . .

EXPOSE 3083

# RUN npm run turbo build --filter=@tsk-man/api...

RUN npm run build
