FROM node:lts-alpine3.22

WORKDIR /app

COPY /src/consumerDivide/consumerDivide.js .

COPY package.json .

RUN npm install

CMD ["node", "consumerDivide.js"]
