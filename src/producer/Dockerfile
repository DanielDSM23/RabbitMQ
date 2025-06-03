FROM node:lts-alpine3.22

WORKDIR /app

COPY /src/producer/producer.js .

COPY package.json .

RUN npm install

CMD ["node", "producer.js"]
