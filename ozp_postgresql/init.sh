#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 \
 --username="$POSTGRES_USER" \
 --quiet \
<<-EOSQL
    CREATE USER ozp_user WITH SUPERUSER LOGIN PASSWORD 'password';

    CREATE DATABASE ozp;
    GRANT ALL PRIVILEGES ON DATABASE ozp TO ozp_user;
EOSQL
