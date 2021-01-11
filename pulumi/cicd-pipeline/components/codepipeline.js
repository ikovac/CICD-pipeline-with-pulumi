'use strict';

const aws = require('@pulumi/aws');
const pulumi = require('@pulumi/pulumi');
const github = require('@pulumi/github');
const { application, applicationDeploymentGroup } = require('./codedeploy');
const codePipelineBucket = require('./s3');
const { codePipelineRole } = require('./iam');

const githubConfig = new pulumi.Config('github');

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
          Owner: githubConfig.get('organization'),
          Repo: githubConfig.get('repo'),
          Branch: githubConfig.get('branch'),
          OAuthToken: githubConfig.getSecret('token')
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

const webhookSecret = githubConfig.getSecret('webhookSecret');
const codePipelineWebhook = new aws.codepipeline.Webhook('demo-code-pipeline-webhook', {
  authentication: 'GITHUB_HMAC',
  targetAction: 'Source',
  targetPipeline: codePipeline.name,
  authenticationConfiguration: {
    secretToken: webhookSecret
  },
  filters: [{
    jsonPath: '$.ref',
    matchEquals: 'refs/heads/{Branch}'
  }]
});

// eslint-disable-next-line no-new
new github.RepositoryWebhook('demo-code-pipeline-repo-webhook', {
  repository: githubConfig.get('repo'),
  configuration: {
    url: codePipelineWebhook.url,
    contentType: 'json',
    insecureSsl: true,
    secret: webhookSecret
  },
  events: ['push']
});

module.exports = codePipeline;
