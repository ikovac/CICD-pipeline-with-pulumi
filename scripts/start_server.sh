#!/bin/bash
cd /home/ubuntu/app
export PATH=$PATH:$(which pm2)
echo $PATH
pm2 start src/app.js
