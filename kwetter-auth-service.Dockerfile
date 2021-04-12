FROM node:14.16-alpine

RUN npm install -g nx

WORKDIR /Kwetter/apps/auth-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/auth-service

RUN nx build auth-service
CMD ["nx", "serve", "auth-service"]
EXPOSE 3001