#!/bin/bash
rm -r dist/templates &> /dev/null
cp -r templates dist/
node ./bin/bundle-templates.js templates dist/templates
