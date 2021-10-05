FROM node:16-slim

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install dependenics
COPY package.json yarn.lock /usr/src/app
RUN yarn install

#bundle app src
COPY . /usr/src/app

CMD [ "yarn", "start" ]