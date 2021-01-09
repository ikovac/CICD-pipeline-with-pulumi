'use strict';

const aws = require('@pulumi/aws');
const pulumi = require('@pulumi/pulumi');
const codePipelineBucket = require('./s3');

const codeDeployRole = new aws.iam.Role('codedeploy-role', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'codedeploy.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }
    ]
  }
});

// eslint-disable-next-line no-new
new aws.iam.RolePolicyAttachment('codedeply-role-policy', {
  policyArn: 'arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole',
  role: codeDeployRole.name
});

const codePipelineRole = new aws.iam.Role('codepipeline-role', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'codepipeline.amazonaws.com'
        },
        Action: 'sts:AssumeRole'
      }
    ]
  }
});

// eslint-disable-next-line no-new
new aws.iam.RolePolicy('codepipelinePolicy', {
  role: codePipelineRole.id,
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          's3:GetObject',
          's3:GetObjectVersion',
          's3:GetBucketVersioning',
          's3:PutObject'
        ],
        Resource: [
          codePipelineBucket.arn,
          pulumi.interpolate`${codePipelineBucket.arn}/*`
        ]
      },
      {
        Effect: 'Allow',
        Action: [
          'codedeploy:*'
        ],
        Resource: '*'
      }
    ]
  }
}, { dependsOn: codePipelineBucket });

module.exports = { codeDeployRole, codePipelineRole };
