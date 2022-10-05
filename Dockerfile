FROM node:14
LABEL org.opencontainers.image.source = "https://github.com/International-Data-Spaces-Association/DataspaceConnectorUI"
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install --no-audit --unsafe-perm
RUN npm run-script build
RUN npm prune --production
RUN rm -r .git
RUN sed -i "s@http://localhost:8083@@g" dist/js/*.js
RUN groupadd -r nonroot && useradd -r -g nonroot nonroot
USER nonroot
CMD ["npm", "run", "backend"]