#!/bin/sh
# Needs database connexion parameters (database, host, port) in env.
# $1 : username to activate

mongo $host:$port/$database --eval "var username='$1';" grant-admin.js
# exit $?
