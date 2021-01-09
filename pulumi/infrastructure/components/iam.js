'use strict';

const aws = require('@pulumi/aws');

const policy = new aws.iam.Policy('ec2-codedeploy-policy', {
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: [
          's3:GetObject',
          's3:GetObjectVersion',
          's3:ListBucke'
        ],
        Effect: 'Allow',
        Resource: '*'
      }
    ]
  }
});

const role = new aws.iam.Role('ec2-codedeploy-role', {
  name: 'ec2-codedeploy',
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'ec2.amazonaws.com'
        },
        Effect: 'Allow'
      }
    ]
  }
});

// eslint-disable-next-line no-new
new aws.iam.RolePolicyAttachment('codedeploy-role-policy', {
  policyArn: policy.arn,
  role: role.name
});

const iamInstanceProfile = new aws.iam.InstanceProfile('ec2-codedeploy-iam-profile', { role: role.name });

module.exports = { iamInstanceProfile };
