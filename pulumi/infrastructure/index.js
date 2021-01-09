'use strict';

const ec2 = require('./components/ec2');

exports.publicIp = ec2.publicIp;
exports.publicDns = ec2.publicDns;
