#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/common.sh


${DOCKER_COMPOSE} down
