import * as AWS from 'aws-sdk';

import { SlackAPI } from '../../../types/slackTypes';
import logger from '../logger';
import { MEME_FEEDBACK } from '../constants';

const ddb = new AWS.DynamoDB.DocumentClient();
const ddbMainClient = new AWS.DynamoDB();
const tableName = process.env.BOKU_MEME_FEEDBACK_TABLE;

const linkRegex = /\<(.+)\>/g;

const ORIGINAL_ACTION_ATTACHMENTS = [
    {
        "name": "feedback",
        "text": ":partydank:",
        "type": "button",
        "value": MEME_FEEDBACK.positiveResponse
    },
    {
        "name": "feedback",
        "text": ":poopmove:",
        "type": "button",
        "value": MEME_FEEDBACK.negativeResponse
    }
]

export default async function handleMemeFeedback(event: SlackAPI.ActionEvent): Promise<SlackAPI.OriginalMessage> {
    const log = logger.child({ function: 'handleMemeFeedback', event });

    log.info('Handling meme feedback...')

    const [ website ] = event.original_message.text.match(linkRegex);
    const feedback = event.actions[0].value == 'good' ? 1 : -1

    const imageUrl = event.original_message.attachments[0].image_url;
    const userId = event.user.id;

    log.info('Checking for previous feedback', { imageUrl, userId })

    const previousUserVote = await ddb.get({
        TableName: tableName,
        Key: {
            'UserId': userId,
            'ImageUrl': imageUrl
        }
    }).promise()

    // previousUserVote will be `{}` if it didnt exist
    if (Object.keys(previousUserVote).length > 0) {
        log.info('User has previously voted on this image', { previousUserVote })
    } else {
        const [ trimmedWebsite ] = website.replace('<', '').replace('>', '').split('|')

        log.info('Setting feedback', { website: trimmedWebsite, feedback })

        await ddb.put({
            TableName: tableName,
            Item: {
                TriggerId: event.trigger_id,
                UserId: event.user.id,
                UserName: event.user.name,
                Website: trimmedWebsite,
                Feedback: feedback,
                ImageUrl: imageUrl
            }
        }).promise()
    }

    // Respond to the message by replacing the original with an additional attachment
    // clone the message
    const message = { ...event.original_message };

    log.info('Fetching all feedback for current image', { imageUrl });

    const allFeedback = await ddbMainClient.scan({
        ExpressionAttributeValues: {
            ':img' : {
                S: imageUrl
            }
        },
        ProjectionExpression: 'ImageUrl, Feedback',
        FilterExpression: 'ImageUrl = :img',
        TableName: tableName,
    }).promise();

    const sumOfGood = allFeedback.Items
        .filter(item => Number(item.Feedback.N) > 0)
        .length;

    const sumOfBad = allFeedback.Items
        .filter(item => Number(item.Feedback.N) < 0)
        .length;

    log.info('Going to respond with current tallies', { sumOfGood, sumOfBad, allFeedback });

    ORIGINAL_ACTION_ATTACHMENTS[0].text = `${sumOfGood} x :partydank:`;
    ORIGINAL_ACTION_ATTACHMENTS[1].text = `${sumOfBad} x :poopmove:`;

    message.attachments[1].actions = ORIGINAL_ACTION_ATTACHMENTS;

    log.info('Executing callback', { callbackMessage: message });

    return message;
}