#!/bin/bash
sudo rm -rf /home/ubuntu/app
if type -P pm2 &>/dev/null
then
  echo "Deleting running app..."
  pm2 stop demo-app 2> /dev/null
  pm2 delete demo-app 2> /dev/null
fi
