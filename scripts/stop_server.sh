#!/bin/bash
sudo rm -rf /home/ubuntu/app
isExistApp = `pgrep pm2`
if [[ -n  $isExistApp ]]; then
  pm2 stop demo-app
  pm2 delete demo-app
fi
