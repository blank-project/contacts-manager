#!/bin/sh
mongoexport --host $host --port $port -d $database -c contacts --type csv --noHeaderLine --fieldFile fieldsExport.txt -o $1
