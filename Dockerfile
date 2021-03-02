FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install --no-audit --unsafe-perm
EXPOSE 8082
CMD ["npm", "start"]
