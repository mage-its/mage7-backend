#!/usr/bin/env bash

cp -a ~/mage7-frontend/dist/uploads/. ~/mage-backup/uploads/
cd ~/mage-backup
rm uploads.zip
zip -r uploads.zip uploads
