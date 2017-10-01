#!/bin/sh
# $1 : database name
# $2 : input file to import
mongoimport -d $1 -c contacts-import --file $2 --type csv --fieldFile fields.txt --ignoreBlanks --drop

# Run post-processing script on the mongo shell.
mongo localhost:27017/$1 post-process.js
