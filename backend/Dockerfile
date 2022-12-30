FROM node:fermium-alpine as build
RUN npm install -g nodemon
WORKDIR /app
COPY ../ .
WORKDIR /app/backend/
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
