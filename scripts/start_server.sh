#!/bin/bash
cd /home/ubuntu/app
echo $PATH
pm2 start src/app.js
