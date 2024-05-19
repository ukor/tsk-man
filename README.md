# tsk_man

A simple CRUD application with authentication and JWT authorization for
experimentation and everything NestJS

The app act as the backend server for a task manager.

## Product Requirements

Users should bale to perform the following actions

- Sign up with email, password, name
- Login with email and password
- Create project
- Add Task to the project

### Project

Every user should be able to create a project, a project can have multiple task
and a project can aslo be called a board. Every project contains 3 sub-category,
namely:

- Todo
- In Progress
- Done Task can be moved from one category to another

## Secret Management

The project currently uses `.env` as a secret management, but I strongly advise
against that in production. `.env` is a good place to start but is very
inefficient for managing and scaling secret. I will recommend the following
service for secret management.

- Google cloud secret manager
- Doppler Secret ops
- Bitwarden Secret manager

These services are better suited for secret and are easy to scale.

## Collaborative Feature with Socket

One way to implement collaborative feature is to use socket. Another way and
much better way is to use CRDT Algorithms.

### Socket

Socket can be leverage here to provide collaborative feature. Depending on my
time and schedule, I may and may not implement that.

### Yjs

For a better collaborative experience I will recommende a
[https://github.com/yjs/yjs](CRDT Implementation). Yjs is always a good place to
start from.

## Database

The project currently uses mongoDb for data storage. I was also considering
SQLit while bootstrapping the project (Hopefully I will revist).

## Why?

- For a job interview
- For trying out all my ideas that I cannot do in a live project. I have always
  wanted to play around with collaborative software. I also want to improve my
  unit testing with NestJS
- Docker - Docker is one of thoes tools I rarely use(I always forget the
  commands). This will give me an oppotunity to go deeper to volume and
  networking. Who knows this may lead me to start exploring cluster management
  with k8s.

## Requirements

- Node version 18 and above
- MongoDb
- Docker, maybe

## Documentation

I plan on using gitbooks, to document all my decission making and issues. This
project will also come with a swagger doc for all the API endpoint. I will also
try to keeep this ReadMe file up to date.
