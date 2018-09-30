#!/usr/bin/env bash

docker-compose exec ozp_api celery -A ozp.celery worker -B -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler