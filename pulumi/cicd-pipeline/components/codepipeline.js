'use strict';

const aws = require('@pulumi/aws');
const pulumi = require('@pulumi/pulumi');
const { application, applicationDeploymentGroup } = require('./codedeploy');
const { codePipelineBucket } = require('./s3');
const { codePipelineRole } = require('./iam');

const config = new pulumi.Config();

const s3kmskey = aws.kms.getAlias({
  name: 'alias/aws/s3'
});

const codePipeline = new aws.codepipeline.Pipeline('cicd-demo-pipeline', {
  name: 'cicd-demo-pipeline',
  roleArn: codePipelineRole.arn,
  artifactStore: {
    location: codePipelineBucket.bucket,
    type: 'S3',
    encryptionKey: {
      id: s3kmskey.then(s3kmskey => s3kmskey.arn),
      type: 'KMS'
    }
  },
  stages: [
    {
      name: 'Source',
      actions: [{
        name: 'Source',
        category: 'Source',
        owner: 'ThirdParty',
        provider: 'GitHub',
        version: '1',
        outputArtifacts: ['source_output'],
        configuration: {
          Owner: 'ikovac',
          Repo: 'CICD-pipeline-with-pulumi',
          Branch: 'master',
          OAuthToken: config.getSecret('githubAuthToken')
        }
      }]
    },
    {
      name: 'Deploy',
      actions: [{
        name: 'Deploy',
        category: 'Deploy',
        owner: 'AWS',
        provider: 'CodeDeploy',
        inputArtifacts: ['source_output'],
        version: '1',
        configuration: {
          ApplicationName: application.name,
          DeploymentGroupName: applicationDeploymentGroup.deploymentGroupName
        }
      }]
    }
  ]
}, { dependsOn: [application, applicationDeploymentGroup] });

module.exports = codePipeline;
