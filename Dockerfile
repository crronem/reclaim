FROM node:10

WORKDIR /usr/src/app
COPY ./package.json yarn.* ./
RUN yarn install --modules-folder ../node_modules/
RUN yarn global add nodemon
COPY ./src ./src
CMD [ "npm", "run", "start:dev" ]