#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/../common.sh

pushd ..

sync_to ozp_api ozp-backend

MIGRATE_CMD="MAIN_DATABASE=psql python manage.py makemigrations ozpcenter --no-input --dry-run --verbosity 3"

docker-compose run --rm -T ozp_api sh -c "$MIGRATE_CMD" > ./ozp_api/output/migrations.txt

popd
