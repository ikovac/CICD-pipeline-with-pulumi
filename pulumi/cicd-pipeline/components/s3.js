'use strict';

const aws = require('@pulumi/aws');

const codePipelineBucket = new aws.s3.Bucket('codepipeline-bucket', { acl: 'private' });

module.exports = codePipelineBucket;
