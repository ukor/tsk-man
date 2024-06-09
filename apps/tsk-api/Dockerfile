FROM node:20-bullseye

WORKDIR /srv

COPY package*.json ./

RUN npm i -g @nestjs/cli

RUN npm install turbo --global

COPY turbo.json turbo.json

RUN npm ci

COPY . .

EXPOSE 3083

RUN turbo run start:dev --filter=@tsk-man/api
