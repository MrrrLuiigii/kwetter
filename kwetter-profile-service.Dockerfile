FROM node:12

WORKDIR /Kwetter/apps/profile-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/profile-service

RUN npm install -g @nrwl/cli@12.0.1

RUN nx build profile-service
CMD ["nx", "serve", "profile-service"]
EXPOSE 3003