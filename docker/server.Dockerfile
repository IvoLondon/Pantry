FROM node:12.16.1-alpine as server
WORKDIR /srv
COPY /server .
RUN npm install --silent
CMD ["npm", "start"]