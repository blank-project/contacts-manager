
# The file to import
mongoimport -d $1 -c contacts-import --type csv --fieldFile fields.txt --ignoreBlanks --file $2

# Run post-processing script on the mongo shell.
mongo localhost:27017/$1 post-process.js
