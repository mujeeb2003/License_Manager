FROM node:20-alpine

WORKDIR /home/node/backend

RUN mkdir -p node_modules

COPY package*.json ./

RUN npm install

COPY . . 

# EXPOSE 3306 5000

# Set the command to run your application
CMD ["node", "app.js"]