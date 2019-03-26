#!/bin/sh
. ./formatDatabaseConnectionUrl.sh
url=$(formatDatabaseConnectionUrl)

echo "Exporting from $url"

mongoexport --uri $url -c contacts --type csv --noHeaderLine --fieldFile fieldsExport.txt --sort '{"name.last":1, "name.first":1}' -o $1 --query $2
