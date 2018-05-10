#!/bin/bash
rm -r dist/arc-templates &> /dev/null
cp -r misc/arc-templates dist/
node ./bin/bundle-templates.js misc/arc-templates dist/arc-templates
