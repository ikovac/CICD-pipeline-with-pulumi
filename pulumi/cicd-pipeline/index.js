'use strict';

const codePipeline = require('./components/codepipeline');
const { applicationDeploymentGroup } = require('./components/codedeploy');

exports.codePipeline = codePipeline.name;
exports.codeDeployGroupId = applicationDeploymentGroup.id;
