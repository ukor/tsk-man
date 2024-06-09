FROM node:alpine3.20

WORKDIR /srv

COPY package*.json ./

RUN npm i -g @nestjs/cli

RUN npm install turbo --global

COPY turbo.json turbo.json

RUN npm install

COPY . .

EXPOSE 3083

CMD turbo run start:dev --filter=@tsk-man/api --env-mode=loose
