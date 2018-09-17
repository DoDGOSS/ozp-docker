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

${DOCKER_COMPOSE} rm -fs ozp_api

sync_to ozp_api ozp-backend

${DOCKER_COMPOSE} build ${BUILD_OPTS} ozp_api
${DOCKER_COMPOSE} up ozp_api
