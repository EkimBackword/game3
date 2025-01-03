FROM node:hydrogen-alpine as build
WORKDIR /usr/src/app
COPY ./shared ./shared
COPY ./frontend ./frontend
RUN cd ./frontend/ && yarn && yarn run build

FROM nginx:stable-alpine
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/frontend/dist/frontend/browser /usr/share/nginx/html
