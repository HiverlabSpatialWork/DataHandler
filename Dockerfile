FROM node:current-alpine3.12

WORKDIR /
COPY package.json .
RUN npm install
COPY . .
EXPOSE 42423
CMD npm start