# Use a Node.js v8 Image
FROM node:8

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5 \
    && echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list \
    && apt-get update \
    && apt-get install -y mongodb-org-tools

# Adds the package.json and bower.json into the container /app directory
# It is done separately from the rest of the files to allow for Docker caching
ADD package.json bower.json /app/

# Move to /app
WORKDIR /app

# Install dependencies
RUN npm install && npm run assets

# Add the rest of the files.
ADD . /app/

# LESS Preprocessing
RUN npm run less

# Expose the port and the app/ folder
EXPOSE 3000
VOLUME /app/
