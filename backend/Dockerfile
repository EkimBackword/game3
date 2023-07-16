FROM node:gallium-alpine as build
RUN npm install -g nodemon
WORKDIR /app
COPY ./shared ./shared
COPY ./backend ./backend
WORKDIR /app/backend
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
