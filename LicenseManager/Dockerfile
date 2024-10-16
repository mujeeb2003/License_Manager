FROM node:20-alpine AS builder

WORKDIR /home/app/frontend

RUN mkdir -p node_modules 

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS final

COPY --from=builder /home/app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

