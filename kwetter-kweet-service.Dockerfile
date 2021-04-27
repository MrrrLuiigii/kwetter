FROM node:12

RUN npm install -g @nrwl/cli@12.0.1

WORKDIR /Kwetter/apps/kweet-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/kweet-service

ENV REDIS_HOST "redis://172.17.0.1:6379"
ENV AUTH_SERVICE_HOST "http://172.17.0.1:3001"

RUN nx build kweet-service
CMD ["nx", "serve", "kweet-service"]
EXPOSE 3005