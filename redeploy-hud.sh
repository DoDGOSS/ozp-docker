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

${DOCKER_COMPOSE} rm -fs ozp_hud

sync_to ozp_hud ozp-hud
sync_to ozp_hud/lib ozp-bootstrap-tour
sync_to ozp_hud/lib ozp-bootstrap-sass
sync_to ozp_hud/lib ozp-classification
sync_to ozp_hud/lib ozp-icons
sync_to ozp_hud/lib ozp-react-commons

${DOCKER_COMPOSE} build ${BUILD_OPTS} ozp_hud
${DOCKER_COMPOSE} up ozp_hud
