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

${DOCKER_COMPOSE} rm -fs ozp_webtop

sync_to ozp_webtop ozp-webtop
sync_to ozp_webtop/lib ozp-bootstrap-sass
sync_to ozp_webtop/lib ozp-classification
sync_to ozp_webtop/lib ozp-icons
sync_to ozp_webtop/lib ozp-iwc

${DOCKER_COMPOSE} build ${BUILD_OPTS} ozp_webtop
${DOCKER_COMPOSE} up ozp_webtop
