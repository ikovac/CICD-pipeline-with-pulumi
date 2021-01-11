#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 12

sudo chmod 777 -R /home/ubuntu/app
cd /home/ubuntu/app
npm i
npm i -g pm2
sudo ln -s $(which pm2) /usr/bin/pm2
