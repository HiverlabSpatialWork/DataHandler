FROM node:12

WORKDIR /
COPY package.json .
RUN npm install
COPY . .
CMD npm start