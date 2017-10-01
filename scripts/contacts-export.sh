#!/bin/sh
mongoexport -d $database -c contacts --type csv --fieldFile fields.txt -o $1
