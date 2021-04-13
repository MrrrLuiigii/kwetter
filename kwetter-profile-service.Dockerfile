FROM node:12

RUN npm install -g nx

WORKDIR /Kwetter/apps/profile-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/profile-service

RUN nx build profile-service
CMD ["nx", "serve", "profile-service"]
EXPOSE 3003