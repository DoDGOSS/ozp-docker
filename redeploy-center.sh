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

${DOCKER_COMPOSE} rm -fs ozp_center

sync_to ozp_center ozp-center
sync_to ozp_center/lib ozp-bootstrap-classify
sync_to ozp_center/lib ozp-bootstrap-tour
sync_to ozp_center/lib ozp-bootstrap-sass
sync_to ozp_center/lib ozp-classification
sync_to ozp_center/lib ozp-icons
sync_to ozp_center/lib ozp-react-commons
sync_to ozp_center/lib ozp-react-select-box
sync_to ozp_center/lib ozp-sweetalert
sync_to ozp_center/lib ozp-ubuntu-fontface
sync_to ozp_center/lib ozp-w2ui

${DOCKER_COMPOSE} build ${BUILD_OPTS} ozp_center
${DOCKER_COMPOSE} up ozp_center
