#!/usr/bin/env bash

function pushd() {
    mkdir -p "$1" && command pushd "$1" > /dev/null
}

function popd() {
    command popd > /dev/null
}

function print_bold() {
	printf "\e[1m$1\e[0m"
}

function is_wsl() {
    local version
    if [ -e /proc/version ]; then
        version=$(head -n 1 /proc/version)
        if [[ ${version} =~ "Microsoft" ]]; then
            return 0;
        fi
    fi

    return 1;
}

function sync_to() {
    printf "$1: copying $2... "

    mkdir -p $1/$2/

    rsync -acmI --exclude=".git/" --exclude="node_modules/" --delete --delete-excluded src/$2/ $1/$2/
    if [ -d "patch/$2" ]; then
        rsync -acmI patch/$2/ $1/$2/
    fi

    printf "Done!\n"
}


IS_WSL=$(is_wsl)

if [ -n "${IS_WSL}" ]; then DOCKER="docker.exe"; else DOCKER="docker"; fi
if [ -n "${IS_WSL}" ]; then DOCKER_COMPOSE="docker-compose.exe"; else DOCKER_COMPOSE="docker-compose"; fi
