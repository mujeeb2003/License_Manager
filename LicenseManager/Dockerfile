FROM node:20-alpine AS builder

WORKDIR /home/app/frontend

RUN mkdir -p node_modules 

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm","run","dev" ]