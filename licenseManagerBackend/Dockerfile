FROM node:20-alpine

WORKDIR /home/node/backend

RUN mkdir -p node_modules

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5000 3306

# Set the command to run your application
CMD ["node", "app.js"]
