FROM node:9.11.2-alpine

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run compile

EXPOSE 80

CMD ["node", "./dist/index.js"]
