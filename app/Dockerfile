FROM node:17.6-alpine3.14 as base

WORKDIR /usr/local/app

COPY package*.json ./

RUN npm install && npm cache clean --force


# Development image, using a bind mount to /app
FROM base as dev

CMD ["npm", "start"]


# Production image
FROM base as prod

COPY ./src /usr/local/app/src
COPY ./public /usr/local/app/public

# this might need to change...
CMD ["npm", "start"]