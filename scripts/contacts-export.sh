#!/bin/sh
mongoexport --host $host --port $port -d $database -c contacts --type csv --noHeaderLine --fieldFile fieldsExport.txt --sort '{"name.last":1, "name.first":1}' -o $1 --query $2
