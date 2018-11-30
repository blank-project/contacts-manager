# contacts-manager

A contact management application.

Uses :
- MongoDB as a NoSQL database
- Node + Express for Web application development.

## Administration
Administration scripts are located in the scripts/ directory.
They are useful until a web-based solution is provided.

All scripts require the host, port and database set in the environment.

### activate-user.sh
Users are created deactivated by default, this script allows to activate a user.

Activate the user with username test :
```
$ sh activate-user.sh test
```

### grant-admin.sh
Users are created with the permission _contact:read_ only by default.
This script allows to grant a user administrative permissions.

Make the user with username test an administrator :
```
$ sh grant-admin.sh test
```

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
