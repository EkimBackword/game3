FROM node:fermium-alpine as build
WORKDIR /usr/src/app
COPY ./shared ./shared
COPY ./frontend ./frontend
RUN cd ./frontend/ && npm install && npm run build

FROM nginx:1.17.1-alpine
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/frontend/dist/frontend /usr/share/nginx/html
