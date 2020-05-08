FROM node:12.16.1-alpine as web-build
RUN apk add --no-cache bash
WORKDIR /web
COPY /web ./
RUN npm install --silent
EXPOSE 3002
CMD ["npm", "run", "develop"]