#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/../common.sh

pushd ..

sync_to ozp_api ozp-backend

TEST_CMD="MAIN_DATABASE=psql TEST_MODE=true pytest --durations=0 $@"

docker-compose run --rm -T ozp_api sh -c "$TEST_CMD" > ./ozp_api/output/test_results.txt

popd
