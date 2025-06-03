FROM node:lts-alpine3.22

WORKDIR /app

COPY /src/consumerAdd/consumerAdd.js .

COPY package.json .

RUN npm install

CMD ["node", "consumerAdd.js"]
