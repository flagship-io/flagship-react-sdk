FROM node:13-alpine

WORKDIR /usr/src/app

ADD package*.json ./

RUN npm install

ADD . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]