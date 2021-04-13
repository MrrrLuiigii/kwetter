FROM node:12

RUN npm install -g @nrwl/cli@12.0.1

WORKDIR /Kwetter/apps/auth-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/auth-service

RUN nx build auth-service
CMD ["nx", "serve", "auth-service"]
EXPOSE 3001