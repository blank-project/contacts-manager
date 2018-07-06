# contacts-manager

A contact management application.

Uses :
- MongoDB as a NoSQL database
- Node + Express for Web application development.

## Contributing

### Docker Container
The app can be deployed into a Docker container for development.  
It has not been configured for Production yet

To build :

```
docker-compose build
```

Building is needed only once provided the Dockerfile, docker-compose.yaml or docker-compose.debug.yaml do not change.

To run :
```
docker-compose up
```

To run in debug mode with live-reload :
```
docker-compose -f docker-compose.yaml -f docker-compose.debug.yaml up
```

Application is then accessible at [http://localhost:3000](http://localhost:3000)

### Legacy

Start app for development : `gulp develop`
Mongo DB service must be running : `sudo service mongod start`
