FROM node:12

RUN npm install -g @nrwl/cli@12.0.1

WORKDIR /Kwetter/apps/mail-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/mail-service

ENV PORT_MAIL ${PORT_MAIL}
ENV SMTP_CONNECTION ${SMTP_CONNECTION}
ENV GATEWAY_HOST ${GATEWAY_HOST}
ENV REDIS_HOST ${REDIS_HOST}
ENV REDIS_PASSWORD ${REDIS_PASSWORD}

RUN nx build mail-service
CMD ["nx", "serve", "mail-service"]
EXPOSE 3002