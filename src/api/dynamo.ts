import * as AWS from 'aws-sdk';
import { ChatPostMessageArguments } from '@slack/web-api';

import { AppMentionEvent } from '@slack/bolt';


let ddb: AWS.DynamoDB.DocumentClient;

export async function putItem(tableName: string, event: AppMentionEvent, message: ChatPostMessageArguments) {
    if (process.env.USE_DB === 'false') return;

    if (!ddb) {
        ddb = new AWS.DynamoDB.DocumentClient();
    }

    return ddb.put({
        TableName: tableName,
        Item: {
            Text: event.text,
            Channel: event.channel,
            User: event.user,
            ReponseText: message.text,
            ResponseAttachments: JSON.stringify(message.attachments)
        }
    }).promise()
}