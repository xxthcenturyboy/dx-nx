MONOREPO_CONTAINER_ID := $(shell docker compose ps -q monorepo-node-22)
CONTAINER_PG := $(shell docker compose ps -q postgres)
POSGRES_SEED_FILE := pg-seed.dump

## start docker shell
shell:
	docker exec -it ${MONOREPO_CONTAINER_ID} /bin/bash

################### API ###################
## start api in nodemon
api:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx serve api

## run e2e tests for the API
api-e2e:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx e2e api-e2e --run-in-band

## run e2e tests for the API with full details
api-e2e-verbose:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx e2e api-e2e --run-in-band --verbose


################### Mobile ###################
## start Mobile in nodemon
mobile:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx start mobile

## run e2e tests for Mobile
mobile-e2e:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx e2e mobile-e2e --run-in-band


################### Web ###################
## start web in nodemon
web:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx serve web

## run e2e tests for the web
web-e2e:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx e2e web-e2e


################### NX Unit Testing ###################
## runs all unit tests
test-all:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx run-many -all --target=test

## runs all unit tests with full detail
test-all-verbose:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx run-many -all --target=test --verbose



################### NX Custom Generators ###################
## runs library module custom generator as a dry run
lib-module-dry:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx generate @dx/plugins-nx:dx-lib-module -d

## runs library module custom generator
lib-module:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx generate @dx/plugins-nx:dx-lib-module



################### Postgres ###################
## start postgres docker shell
shell-pg:
	docker exec -it ${CONTAINER_PG} /bin/bash

## creates the db and initial tables
initialize-pg:
	docker exec -it ${CONTAINER_PG} createdb -T template0 dx-nx --username=pguser
	docker cp ./libs/data/postgres/src/dump/${POSGRES_SEED_FILE} ${CONTAINER_PG}:/
	docker exec -it ${CONTAINER_PG} pg_restore --username=pguser -d dx-nx ./${POSGRES_SEED_FILE}

## seeds the database
seed-pg:
	docker cp ./libs/data/postgres/src/dump/${POSGRES_SEED_FILE} ${CONTAINER_PG}:/
	docker exec -it ${CONTAINER_PG} pg_restore --username=pguser -d dx-nx ./${POSGRES_SEED_FILE}

## creates the seed file
dump-pg:
	docker exec -it ${CONTAINER_PG} sh -c "pg_dump --username=pguser -Fc dx-nx > /${POSGRES_SEED_FILE}"
	docker cp ${CONTAINER_PG}:/${POSGRES_SEED_FILE} ./libs/data/postgres/src/dump/${POSGRES_SEED_FILE}
