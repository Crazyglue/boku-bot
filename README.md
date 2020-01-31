# boku-bot

To deploy `boku-bot`, run the following commands with AWS CLI.

Pick an S3 bucket to store SAM artifacts in

```
SAM_BUCKET="some-bucket-name"
```

Package up the stuff

```shell
aws \
    cloudformation package \
        --template-file template.yaml \
        --s3-bucket ${SAM_BUCKET} \
        --output-template-file packaged.yml
```

Deploy it

```shell
SECRET_VALUE="dzugan1234"
aws \
    cloudformation deploy \
        --stack-name "boku-infra" \
        --template-file packaged.yml \
        --capabilities 'CAPABILITY_IAM' 'CAPABILITY_NAMED_IAM' \
        --parameter-overrides \
            "pSomeSecret=${SECRET_VALUE}"
```

Go check in the CloudFormation console...you should see your stack being created (i.e. `boku-bot` coming to life).
