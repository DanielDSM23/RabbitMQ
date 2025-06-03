FROM node:lts-alpine3.22

WORKDIR /app

COPY /src/consumerSubstract/consumerSubstract.js .

COPY package.json .

RUN npm install

CMD ["node", "consumerSubstract.js"]
