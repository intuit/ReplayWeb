#!/bin/bash
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"
PATH="$ROOT_DIR/node/bin:$PATH"
DIST_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$(which node) $DIST_DIR/native.js
