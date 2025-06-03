FROM node:lts-alpine3.22

WORKDIR /app

COPY /src/consumer/consumer.js .

COPY package.json .

RUN npm install

CMD ["node", "consumer.js"]
