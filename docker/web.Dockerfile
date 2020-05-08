FROM node:12.16.1-alpine as web-build
WORKDIR /web
COPY /web ./
RUN npm install --silent
CMD ["npm", "run", "dev"]
# RUN npm run build

# FROM nginx
# COPY - from=web-build /web/build /usr/share/nginx/html/
# EXPOSE 80
# CMD [“nginx”, “-g”, “daemon off;”]
