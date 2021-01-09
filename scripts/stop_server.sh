#!/bin/bash
cd /home/ubuntu/app
isExistApp = `pgrep pm2`
if [[ -n  $isExistApp ]]; then
  pm2 stop 0
  pm2 remove 0
fi
