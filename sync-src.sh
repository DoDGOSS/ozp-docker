#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/common.sh


print_bold "Synchronizing source files and applying patches...\n"

sync_to ozp_api ozp-backend

sync_to ozp_auth ozp-demo-auth-service

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

sync_to ozp_demo ozp-demo-apps
sync_to ozp_demo/lib ozp-data-schemas
sync_to ozp_demo/lib ozp-iwc

sync_to ozp_hud ozp-hud
sync_to ozp_hud/lib ozp-bootstrap-tour
sync_to ozp_hud/lib ozp-bootstrap-sass
sync_to ozp_hud/lib ozp-classification
sync_to ozp_hud/lib ozp-icons
sync_to ozp_hud/lib ozp-react-commons

sync_to ozp_webtop ozp-webtop
sync_to ozp_webtop/lib ozp-bootstrap-sass
sync_to ozp_webtop/lib ozp-classification
sync_to ozp_webtop/lib ozp-icons
sync_to ozp_webtop/lib ozp-iwc

sync_to ozp_help ozp-help
sync_to ozp_help/lib ozp-bootstrap-sass
sync_to ozp_help/lib ozp-icons
sync_to ozp_help/lib ozp-react-commons
