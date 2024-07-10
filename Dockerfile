FROM node:slim

COPY package*.json ./

# Set the working directory
WORKDIR /app

COPY . .

RUN npm install

# Install TypeScript, ts-node, nodemon e seqeulize-cli

RUN npm install -g typescript ts-node nodemon sequelize-cli

# Compile ts in js
RUN tsc

# Run the app
CMD ["nodemon", "app.ts"]