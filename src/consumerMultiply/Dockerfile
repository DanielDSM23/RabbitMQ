FROM node:lts-alpine3.22

WORKDIR /app

COPY /src/consumerMultiply/consumerMultiply.js .

COPY package.json .

RUN npm install

CMD ["node", "consumerMultiply.js"]
