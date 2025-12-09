#!/bin/bash
cd /home/kavia/workspace/code-generation/furniture-shopping-app-221594-221603/furniture_shopping_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
 if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

