#!/bin/bash
exportsecrets() {
  VAULT_PATH="v1/dx/data/$1"
  echo "VAULT_PATH=$VAULT_PATH"

  VAULT_OUTPUT=`curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET $VAULT_ADDR/$VAULT_PATH`
  if [[ "$(echo $VAULT_OUTPUT | jq -r '.errors')" != "null" ]]; then
    echo Error from Vault $VAULT_ADDR/$VAULT_PATH
    echo $VAULT_OUTPUT
    exit 1
  fi

  echo $VAULT_OUTPUT | jq -r '.data.data | to_entries|map("\(.key)=\(.value|tostring)")|.[]' | sed -Ee 's/([`$\\])/\\\1/g' >> .env
  export $(<.env)
}

main() {
  set -ev

  rm -f build.log
  LOG_START_TIME=`date +%s`
  echo start_time{} `echo $LOG_START_TIME` | tee -a build.log

  export VAULT_ADDR=${VAULT_ADDR:-"https://vault.net"}

  if [[ -z "$VAULT_TOKEN" ]]; then
    VAULT_TOKEN=$(vault login -token-only -method=aws role=dx-reader)
  fi

  if [[ -z "$VAULT_TOKEN" ]]; then
    echo "VAULT_TOKEN required" >&2
    exit 1
  fi

  export PACKAGE_ENV=${VAULT_KV_PATH##*/}
  echo "Exporting Vault secrets for PACKAGE_ENV=$PACKAGE_ENV ..."

  exportsecrets "monorepo/dx-api-legacy/$PACKAGE_ENV"
  exportsecrets "monorepo/dx-build-version/$PACKAGE_ENV"

  VAULT_DEVOPS_PATH=${VAULT_DEVOPS_PATH#*/}
  # VAULT_DEVOPS_PATH=devops/gatsbycicd/aws4
  exportsecrets $VAULT_DEVOPS_PATH

  echo && echo ======= env =======
  env | grep -v -e KEY -e TOKEN -e PASS
  env | grep -e KEY -e TOKEN -e PASS | sed 's,=.*,=***********,'
  echo ======= env ======= && echo

  ARGS="$@"
  ARGS="${ARGS:-npm run serve}"
  echo "CMD: $ARGS"
  eval $ARGS

  rm -rf .env

  echo ====== build.log ======
  cat build.log
  echo ====== build.log ======
  rm build.log
}

main "$@"
