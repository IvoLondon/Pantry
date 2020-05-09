FROM node:12.16.1-alpine as server
RUN apk add --no-cache bash
WORKDIR /srv
COPY /server .
RUN npm install --silent
EXPOSE 9002
CMD ["npm", "run", "prod"]