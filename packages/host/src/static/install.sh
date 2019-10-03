#!/bin/bash

PATH="$(pwd)/dist"
SRC="$PATH/com.intuit.replayweb.json"
DESTINATION="/Users/$(/usr/bin/whoami)/Library/Application Support/Google/Chrome/NativeMessagingHosts"
/usr/bin/sed -i '' "s~/<PATH TO REPLAYKIT>~$(pwd)~g" $SRC
/bin/cp "$SRC" "$DESTINATION"
