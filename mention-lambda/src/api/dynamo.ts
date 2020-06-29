import * as AWS from 'aws-sdk';

import { SlackAPI } from "../../../types/slackTypes";

const ddb = new AWS.DynamoDB.DocumentClient();

export async function putItem(tableName: string, event: SlackAPI.Event, message: SlackAPI.SlackPost) {
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