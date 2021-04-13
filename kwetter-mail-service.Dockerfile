FROM node:12

WORKDIR /Kwetter/apps/mail-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/mail-service

RUN nx build mail-service
CMD ["nx", "serve", "mail-service"]
EXPOSE 3002