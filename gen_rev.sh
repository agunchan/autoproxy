#!/bin/sh

BUILD=$(git describe --tag)
VERSION=$(grep version package.json | cut -d\" -f4)

sed -i "s/{{VERSION}}/${VERSION}/g" components/AutoProxy.js
sed -i "s/{{BUILD}}/${BUILD}/g" components/AutoProxy.js
