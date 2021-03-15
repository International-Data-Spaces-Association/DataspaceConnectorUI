#!/bin/bash
set -xe
: "${UI_BACKEND_URL?Need an ui backend url}"

sed -i "s@#UI_BACKEND_URL#@$UI_BACKEND_URL@g" .env
sed -i "s@#UI_TITLE#@$UI_TITLE@g" .env

npm run-script startprod
