#!/bin/bash
set -xe
: "${UI_BACKEND_URL?Need an ui backend url}"

echo  "ENTRY ENV: $UI_BACKEND_URL"
sed -i "s@#NOTSET#@$UI_BACKEND_URL@g" .env

npm start
