#!/bin/bash

ROCKET_CHAT_DIR=/app/Rocket.Chat
NODE_MODULES_CACHE_FILE=/app/meta/node_modules.tar.gz
METEOR_LOCAL_CACHE_FILE=/app/meta/meteor/meteor-local.tar.gz

NODE_MODULES_TEST_DIR=/app/Rocket.Chat/node_modules/.cache
METEOR_LOCAL_TEST_FILE=/app/Rocket.Chat/.meteor/local/resolver-result-cache.json

cd $ROCKET_CHAT_DIR

if [ ! -d "$NODE_MODULES_TEST_DIR" ]
then
    tar zxf $NODE_MODULES_CACHE_FILE
fi

if [ ! -d "$METEOR_LOCAL_TEST_FILE" ]
then
    tar zxf $METEOR_LOCAL_CACHE_FILE
fi

