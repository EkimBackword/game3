FROM node:gallium-alpine as build
WORKDIR /usr/src/app
COPY ./shared ./shared
COPY ./frontend ./frontend
RUN cd ./frontend/ && yarn && yarn run build

FROM nginx:stable-alpine
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/frontend/dist/frontend /usr/share/nginx/html
