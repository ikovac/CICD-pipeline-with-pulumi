'use strict';

const aws = require('@pulumi/aws');
const { codeDeployRole } = require('./iam');

const application = new aws.codedeploy.Application('cicd-demo-app', {
  computePlatform: 'Server',
  name: 'cicd-demo-app'
});

const applicationDeploymentGroup = new aws.codedeploy.DeploymentGroup('cicd-demo-dpl-grp', {
  appName: application.name,
  deploymentGroupName: 'cicd-demo-dpl-group',
  serviceRoleArn: codeDeployRole.arn,
  ec2TagSets: [{
    ec2TagFilters: [
      {
        key: 'name',
        type: 'KEY_AND_VALUE',
        value: 'pulumi-demo'
      }
    ]
  }]
});

module.exports = { application, applicationDeploymentGroup };
