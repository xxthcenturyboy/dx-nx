MONOREPO_CONTAINER_ID := $(shell docker compose ps -q monorepo-node-20)

## start docker shell
shell:
	docker exec -it ${MONOREPO_CONTAINER_ID} /bin/bash

################### API ###################
## start api in nodemon
api:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx serve api

## run e2e tests for the API
api-e2e:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx e2e api-e2e

## run e2e tests for the API with full details
api-e2e-verbose:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx e2e api-e2e --verbose

## runs all unit tests
test-all:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx run-many -all --target=test

## runs all unit tests with full detail
test-all-verbose:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx run-many -all --target=test --verbose

## runs library module custom generator as a dry run
lib-module-dry:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx generate @dx/plugins-nx:dx-lib-module -d

## runs library module custom generator
lib-module:
	docker exec -it ${MONOREPO_CONTAINER_ID} nx generate @dx/plugins-nx:dx-lib-module
