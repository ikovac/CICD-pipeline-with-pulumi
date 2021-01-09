#!/bin/bash
apt update
apt install nodejs -y
apt install npm -y
npm i npm@latest -g
npm i n -g
n stable
