# Launch
## Clone and install
1. Clone git repo
2. RUN `cd CICD-pipeline-with-pulumi`
3. RUN `npm install`

## Deploy infrastructure
1. `cd` inside `pulumi/infrastructure` folder
2. Create new pulumi stack `pulumi stack init <stack-name>`. For example: `pulumi stack init dev`.
3. Add all config variables from the `pulumi.yaml` to stack configuration.
RUN `pulumi config set <key> <value>`. For example: `pulumi config set aws:region us-east-1`.
4. RUN `pulumi up` command \
The infrastructure should now be deployed 🎉

## Deploy CI/CD pipeline
1. `cd` inside `pulumi/cicd-pipeline` folder
2. Create new pulumi stack `pulumi stack init <stack-name>`
3. Add all config variables from the `pulumi.yaml` to stack configuration. To add secrets use `pulumi config set <key> <value> --secret` command.
4. RUN `pulumi up` command \
The pipeline should now be deployed 🎉
