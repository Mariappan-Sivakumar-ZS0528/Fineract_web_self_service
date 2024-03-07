FROM node:10-alpine as builder

RUN apk update
RUN apk add git
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY gulpfile.js /usr/src/app/gulpfile.js
RUN npm install  bower
RUN npm install  gulp-cli
COPY . /usr/src/app
RUN git config --global url."https://".insteadOf git:// && \
    npm config set strict-ssl false
RUN bower --allow-root install
RUN npm install -f
RUN npm install --save-dev gulp
RUN npm install --save-dev gulp-inject
RUN  npm install --save-dev gulp-ruby-sass
COPY gulpfile.js /usr/src/app/gulpfile.js
RUN gulp build  
COPY /app/assets/stylesheets /usr/src/app/dist

FROM nginx:1.19.3
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
