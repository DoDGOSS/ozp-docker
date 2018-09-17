#!/usr/bin/env bash

SCRIPT_DIR=$(dirname $0)
source ${SCRIPT_DIR}/common.sh


REPOSITORY=""


function checkout() {
    local name="$1"
    local repository="$2"
    local branch_or_commit="$3"

    if [ -d "$name" ]; then
        printf "'$name' already exists; skipping...\n"
    else
        printf "Checking out '$name'... "
        git clone --quiet "$repository" "$name"

        if [ ! -z "$branch_or_commit" ]; then
            pushd "$name"
            git checkout --quiet "$branch_or_commit"
            popd

        fi

        printf "Done!\n"
    fi
}


pushd src

print_bold "Checking out repositories...\n"

checkout ozp-backend            "$REPOSITORY/ozp-backend.git"            release/rc1
checkout ozp-bootstrap-classify "$REPOSITORY/ozp-bootstrap-classify.git" release/rc1
checkout ozp-bootstrap-sass     "$REPOSITORY/ozp-bootstrap-sass.git"     release/rc1
checkout ozp-bootstrap-tour     "$REPOSITORY/ozp-bootstrap-tour.git"     release/rc1
checkout ozp-center             "$REPOSITORY/ozp-center.git"             release/rc1
checkout ozp-classification     "$REPOSITORY/ozp-classification.git"     release/rc1
checkout ozp-data-schemas       "$REPOSITORY/ozp-data-schemas.git"       release/rc1
checkout ozp-demo-apps          "$REPOSITORY/ozp-demo-apps.git"          release/rc1
checkout ozp-demo-auth-service  "$REPOSITORY/ozp-demo-auth-service.git"  release/rc1
checkout ozp-help               "$REPOSITORY/ozp-help.git"               release/rc1
checkout ozp-hud                "$REPOSITORY/ozp-hud.git"                release/rc1
checkout ozp-icons              "$REPOSITORY/ozp-icons.git"              release/rc1
checkout ozp-iwc                "$REPOSITORY/ozp-iwc.git"                release/rc1
checkout ozp-react-commons      "$REPOSITORY/ozp-react-commons.git"      release/rc1
checkout ozp-react-select-box   "$REPOSITORY/ozp-react-select-box.git"   release/rc1
checkout ozp-sweetalert         "$REPOSITORY/ozp-sweetalert.git"         release/rc1
checkout ozp-ubuntu-fontface    "$REPOSITORY/ozp-ubuntu-fontface.git"    release/rc1
checkout ozp-w2ui               "$REPOSITORY/ozp-w2ui.git"               release/rc1
checkout ozp-webtop             "$REPOSITORY/ozp-webtop.git"             release/rc1

popd
