'use strict';

const aws = require('@pulumi/aws');
const awsx = require('@pulumi/awsx');

const vpc = awsx.ec2.Vpc.getDefault();

const ec2SecurityGroup = new aws.ec2.SecurityGroup('server-sec-grp', {
  ingress: [
    { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 3000, toPort: 3000, cidrBlocks: ['0.0.0.0/0'] }
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }
  ],
  vpcId: vpc.id
});

module.exports = { vpc, ec2SecurityGroup };
