formatDatabaseConnectionUrl () {
    url="mongodb://"
    if [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ]
    then
        url="$url$DB_USER:$DB_PASSWORD@"
    fi
    url="$url$DB_HOST"
    if [ -n "$DB_PORT" ]
    then
        url="$url:$DB_PORT"
    fi
    url="$url/$DB_DATABASE"
    if [ -n "$DB_OPTS" ]
    then
        url="$url?$DB_OPTS"
    fi
    echo $url
}
