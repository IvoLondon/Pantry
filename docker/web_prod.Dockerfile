FROM node:12.16.1-alpine as web-prod
WORKDIR /web
COPY /web ./
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=web-prod /web/build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
