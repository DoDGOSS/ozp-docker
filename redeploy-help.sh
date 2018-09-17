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

${DOCKER_COMPOSE} rm -fs ozp_help

sync_to ozp_help ozp-help
sync_to ozp_help/lib ozp-bootstrap-sass
sync_to ozp_help/lib ozp-icons
sync_to ozp_help/lib ozp-react-commons

${DOCKER_COMPOSE} build ${BUILD_OPTS} ozp_help
${DOCKER_COMPOSE} up ozp_help
