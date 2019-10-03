#!/bin/bash
set -e

mkdir /tmp/replayweb
git clone git@github.com:intuit/replayweb.git /tmp/replayweb
cp -r /tmp/replayweb/packages/host ~/.replay-host
rm -r /tmp/replayweb
cd ~/.replay-host
curl -o node.tar.gz https://nodejs.org/dist/v8.12.0/node-v8.12.0-darwin-x64.tar.gz
mkdir node
tar xvf node.tar.gz -C node --strip-components 1
rm node.tar.gz
node/bin/npm i
node/bin/npm run build
node/bin/npm run register
