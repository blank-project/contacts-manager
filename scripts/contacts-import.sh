#!/bin/sh
# Needs database connexion parameters (database, host, port) in env.
# $1 : input file to import
. ./formatDatabaseConnectionUrl.sh
url=$(formatDatabaseConnectionUrl)

echo "Importing to $url"

mongoimport --uri $url -c contacts-import --file $1 --type csv --fieldFile fields.txt --ignoreBlanks --drop

echo $?
# Run post-processing script on the mongo shell.
mongo $url post-process.js

echo $?

rm $1
