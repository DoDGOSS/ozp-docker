#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/common.sh


# Command line arguments

BUILD_OPTS=""

while [ $# -gt 0 ] ; do
    case "$1" in
        --rebuild) BUILD_OPTS="$BUILD_OPTS --no-cache" ;;
    esac
    shift
done


# Main script

# ${DOCKER_COMPOSE} -f docker-compose.test.yml rm -fs ozp_api_1 ozp_api_2
${DOCKER_COMPOSE} -f docker-compose.test.yml rm -fs ozp_api_2

sync_to ozp_api ozp-backend

# ${DOCKER_COMPOSE} -f docker-compose.test.yml build ${BUILD_OPTS} ozp_api_1 ozp_api_2
${DOCKER_COMPOSE} -f docker-compose.test.yml build ${BUILD_OPTS} ozp_api_2
# ${DOCKER_COMPOSE} -f docker-compose.test.yml up ozp_api_1 ozp_api_2
${DOCKER_COMPOSE} -f docker-compose.test.yml up ozp_api_2


