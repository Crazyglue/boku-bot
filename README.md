# boku-bot

To deploy `boku-bot`, run the following commands.

First create a `.env` file in the root of the project.

Populate it with the S3 bucket to store

Populate it with an S3 bucket to store SAM artifacts in and an AWS region

```
BOKU_BOT_S3_BUCKET=my-dank-bucket
AWS_REGION=us-east-1
```

Build and Deploy BokuBot

```shell
npm run deploy
```

You should see the successful message: `Successfully created/updated stack - BokuBotStack in <AWS_REGION>`
