FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install --no-audit --unsafe-perm
RUN npm run-script build
RUN npm prune --production
RUN rm -r .git
RUN sed -i "s@http://localhost:8083@@g" dist/js/*.js
ENTRYPOINT ["./entryPoint.sh"]
