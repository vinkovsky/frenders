FROM node:alpine

RUN apk add --update python make g++ && rm -rf /var/cache/apk/*
RUN mkdir /app

WORKDIR /app

COPY ./package*.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./ ./

CMD ["yarn", "build"]
CMD ["yarn", "start"]
