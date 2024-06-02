#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RESET='\033[0m'

NPMRC=/root/.npmrc
if test -f "$NPMRC"; then
    echo -e "${GREEN}[+] $NPMRC exists.${RESET}"
else
    echo -e "${RED}[+] $NPMRC does NOT exist. You WILL experience issues installing private NPM packages.${RESET}"
fi

GITCONFIG=/root/.gitconfig
if test -f "$GITCONFIG"; then
    echo -e "${GREEN}[+] $GITCONFIG exists.${RESET}"
else
    echo -e "${RED}[+] $GITCONFIG does NOT exist. You WILL experience issues running git commands in the container shell.${RESET}"
fi

echo -e "${BLUE}[+] Location '$(pwd)'${RESET}"

echo -e "${CYAN}[+] Running: yarn install${RESET}"
yarn install

/bin/bash
