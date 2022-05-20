# base image
FROM node:16

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# install dependencies
# Layer will only rebuild if dependencies change
COPY package.json package-lock.json ./
RUN npm ci


# copy source files
COPY . .

# start app
RUN npm run build
EXPOSE 3000
CMD npm run start
