# build environment
FROM node:14-alpine as builder_SDK
ENV YARN_CACHE_FOLDER=/usr/local/yarn-cache
VOLUME /usr/local/yarn-cache

WORKDIR /build

ADD . .

RUN yarn install
RUN yarn build


FROM node:14-alpine as build_qa
ENV YARN_CACHE_FOLDER=/usr/local/yarn-cache
VOLUME /usr/local/yarn-cache

WORKDIR /app

ADD ./example/test-react-dev ./example/test-react-dev

COPY --from=builder_SDK build/dist  ./dist

ADD ./package.json .

WORKDIR /dist

RUN ls -hl

WORKDIR /app/example/test-react-dev

RUN yarn install
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build_qa app/example/test-react-dev/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]