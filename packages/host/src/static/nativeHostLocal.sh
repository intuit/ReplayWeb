#!/bin/bash
source ~/.bash_profile
DIST_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$(which node) $DIST_DIR/native.js
