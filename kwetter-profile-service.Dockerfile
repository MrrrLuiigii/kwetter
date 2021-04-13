FROM node:12

RUN npm install -g @nrwl/cli@12.0.1

WORKDIR /Kwetter/apps/profile-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/profile-service

ENV REDIS_HOST "redis://172.17.0.1:6379"

RUN nx build profile-service
CMD ["nx", "serve", "profile-service"]
EXPOSE 3003