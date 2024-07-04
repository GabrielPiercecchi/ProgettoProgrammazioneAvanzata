FROM node:14

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file dell'applicazione
COPY . .

RUN npm install

# Compila TypeScript in JavaScript
#RUN npm run build  # Compila i file TypeScript in JavaScript

# Installa TypeScript, ts-node e nodemon
#RUN npm install -g typescript ts-node nodemon
RUN npm install -g typescript ts-node nodemon sequelize-cli sequelize-auto-migrations

# Compila i file TypeScript in JavaScript
RUN tsc

# Espone la porta
EXPOSE 3000

# Comando per avviare l'applicazione
#CMD ["nodemon", "--exec", "ts-node", "src/app.ts"]

CMD ["nodemon", "app.ts"]

#CMD ["npm", "run", "dev"]

#--------------------------------------------
