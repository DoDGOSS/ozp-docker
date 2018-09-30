#!/usr/bin/env bash

make clean pre
make use_psql db_migrate

printf "Waiting for remote server\n"
until $(curl --output /dev/null --silent --fail http://remote:8001/health_check/) ; do
    printf '.\n'
    sleep 1
done
printf "Ready!\n"

TEST_MODE=True pytest integration_tests/test_import_from_remote.py
