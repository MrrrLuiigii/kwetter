FROM node:12

RUN npm install -g @nrwl/cli@12.0.1

WORKDIR /Kwetter/apps/trend-service
COPY package.json .

RUN npm install
ADD . /Kwetter/apps/trend-service

ENV PORT_TREND ${PORT_TREND}
ENV AUTH_SERVICE_HOST ${AUTH_SERVICE_HOST}
ENV GATEWAY_HOST ${GATEWAY_HOST}
ENV REDIS_HOST ${REDIS_HOST}
ENV REDIS_PASSWORD ${REDIS_PASSWORD}
ENV TYPEORM_CONNECTION ${TYPEORM_CONNECTION}
ENV TYPEORM_HOST ${TYPEORM_HOST}
ENV TYPEORM_USERNAME ${TYPEORM_USERNAME}
ENV TYPEORM_PASSWORD ${TYPEORM_PASSWORD}
ENV TYPEORM_PORT ${TYPEORM_PORT}
ENV TYPEORM_SYNCHRONIZE ${TYPEORM_SYNCHRONIZE}
ENV TYPEORM_LOGGING ${TYPEORM_LOGGING}
ENV TYPEORM_DATABASE_TREND ${TYPEORM_DATABASE_TREND}

RUN nx build trend-service
CMD ["nx", "serve", "trend-service"]
EXPOSE 3004