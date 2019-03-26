#!/bin/sh
# Needs database connexion parameters (database, host, port) in env.
# $1 : username to activate
. ./formatDatabaseConnectionUrl.sh
url=$(formatDatabaseConnectionUrl)
mongo $url --eval "var username='$1';" grant-admin.js
# exit $?
