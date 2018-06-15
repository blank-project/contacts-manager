# contacts-manager

A contact management application.

Uses :
- MongoDB as a NoSQL database
- Node + Express for Web application development.

## Contributing

### Docker Container
The app can be deployed into a Docker container for development.  
It has not been configured for Production yet

To run :

```
docker-compose build
```

And then
```
docker-compose up
```

Application is then accessible at [http://localhost:3000](http://localhost:3000)

### Legacy
Start app for development : `gulp develop`
Mongo DB service must be running : `sudo service mongod start`
