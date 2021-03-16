FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install -g serve
RUN npm install --no-audit --unsafe-perm
RUN npm run-script build
EXPOSE 80
EXPOSE 8082
ENTRYPOINT ["./entryPoint.sh"]
