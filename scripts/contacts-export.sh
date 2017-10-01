#!/bin/sh
mongoexport -d $1 -c contacts --type csv --fieldFile fields.txt -o test.csv
