# Build frontend with Nodejs + Webpack
FROM node:14-buster
WORKDIR /usr/src/client

# Install dependencies
COPY ./package*.json ./
RUN npm install

# Copy sources for build. Note that .dockerignore might exclude some files.
COPY ./webpack.config.js ./index.js ./
COPY ./lib ./lib

# Begin to build artifacts to /usr/src/client/dist
CMD ["npx", "webpack", "--watch"]
