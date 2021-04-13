FROM node:12

RUN npm install -g @nrwl/cli@12.0.1

WORKDIR /Kwetter/apps/mail-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/mail-service

ENV REDIS_HOST "redis://172.17.0.1:6379"

RUN nx build mail-service
CMD ["nx", "serve", "mail-service"]
EXPOSE 3002