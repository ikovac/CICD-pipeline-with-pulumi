'use strict';

const aws = require('@pulumi/aws');
const pulumi = require('@pulumi/pulumi');
const { ec2SecurityGroup } = require('./vpc');
const { iamInstanceProfile } = require('./iam');

const config = new pulumi.Config();

const publicKey = config.get('publicKey');
const sshKeyPair = new aws.ec2.KeyPair('cd-key', { publicKey });

const userData =
`#!/bin/bash
sudo su
apt update
apt install ruby -y
apt install wget -y
apt install awscli
cd /home/ubuntu
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
./install auto > /tmp/logfile`;

const server = new aws.ec2.Instance('server', {
  ami: 'ami-0885b1f6bd170450c', // Ubuntu Server 20.04 LTS (HVM), SSD Volume Type
  instanceType: 't2.micro',
  keyName: sshKeyPair.keyName,
  vpcSecurityGroupIds: [ec2SecurityGroup.id],
  iamInstanceProfile, // Add IAM role to the instance
  userData,
  tags: {
    name: 'pulumi-demo'
  }
});

// eslint-disable-next-line no-new
new aws.ssm.Parameter('public-dnv-env', {
  name: '/dev/publicDns',
  type: 'String',
  value: server.publicDns
});

module.exports = server;
