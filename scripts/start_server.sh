#!/bin/bash
sudo chmod 777 -R /home/ubuntu/app
cd /home/ubuntu/app
npm i
pm2 start src/app.js
