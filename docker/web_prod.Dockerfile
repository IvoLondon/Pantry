FROM node:12.16.1-alpine as prod
WORKDIR /web
COPY /web .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html/
COPY --from=prod /web/build .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
