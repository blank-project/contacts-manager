#!/bin/sh
# Needs database connexion parameters (database, host, port) in env.
# $1 : input file to import
mongoimport --host $host --port $port -d $database -c contacts-import --file $1 --type csv --fieldFile fields.txt --ignoreBlanks --drop

echo $?
# Run post-processing script on the mongo shell.
mongo $host:$port/$database post-process.js

echo $?

rm $1
