#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/common.sh


print_bold "Synchronizing source files and applying patches...\n"

sync_to ozp_api ozp-backend
