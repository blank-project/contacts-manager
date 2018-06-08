# Use a Node.js v8 Image
FROM node:8

# Adds the package.json into the container /app directory
# It is done separately from the rest of the files to allow for Docker caching
ADD package.json /app/
 
# Move to /app
WORKDIR /app

# Install dependencies
RUN npm install && npm run assets

# Add the rest of the files.
ADD . /app/

# LESS Preprocessing
npm run less

# Expose the port and the app/ folder
EXPOSE 3000
VOLUME /app/

# Run node
CMD npm start