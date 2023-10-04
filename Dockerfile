# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine as build

WORKDIR /usr/src/app

# Copy the rest of the source files into the image.
COPY . .

RUN npm install

RUN npm run build

FROM node:${NODE_VERSION}-alpine as runtime

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
