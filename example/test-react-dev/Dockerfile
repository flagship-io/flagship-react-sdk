# build environment
FROM node:14-alpine as builder_SDK

WORKDIR /build

ADD . .

RUN yarn install
RUN yarn build


FROM node:14-alpine as build_qa

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
COPY example/test-react-dev/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build_qa app/example/test-react-dev/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]