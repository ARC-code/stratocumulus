# Stage 1: Build frontend with Nodejs + Webpack
FROM node:14-buster AS client_build
WORKDIR /usr/src/client
# Copy client sources. Note some files ignored by .dockerignore
COPY ./client/ ./
# Install dependencies and build with webpack
RUN npm install
RUN npm run build

# Stage 2: Install and start up the Flask server
FROM python:3.8-slim-buster
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY ./server/ ./
CMD ["gunicorn", "stratocumulus:app", "--worker-class", "gevent", "--bind", "0.0.0.0:8000"]
