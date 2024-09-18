FROM node:20-alpine AS builder

WORKDIR /home/app/frontend

RUN mkdir -p node_modules 

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm","run","build"]


FROM nginx:alpine AS final

COPY --from=builder /home/app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

