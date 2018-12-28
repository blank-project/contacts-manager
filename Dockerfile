# Use a Node.js v8 Image
FROM node:8

RUN \
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 \
&& echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list \
&& apt-get update \
&& apt-get install -y mongodb-org-shell mongodb-org-tools

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
EXPOSE 3000 9229
VOLUME /app/
