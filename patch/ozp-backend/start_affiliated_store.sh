#!/usr/bin/env bash

make clean pre
make use_psql db_migrate

MAIN_DATABASE=psql python manage.py runscript affiliated_store_data

make use_psql run
