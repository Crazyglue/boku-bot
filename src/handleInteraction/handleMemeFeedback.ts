import * as AWS from 'aws-sdk';

import { SlackAPI } from '../../types/slackTypes';
import logger from '../logger';

const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.BOKU_MEME_FEEDBACK_TABLE;

const linkRegex = /\<(.+)\>/g;

export default async function handleMemeFeedback(event: SlackAPI.Event): Promise<void> {
    const log = logger.child({ function: 'handleMemeFeedback', event });

    log.info('Handling meme feedback...')

    const [ website ] = event.original_message.text.match(linkRegex)
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
        return;
    }

    log.info('Setting feedback', { website, feedback })

    await ddb.put({
        TableName: tableName,
        Item: {
            TriggerId: event.trigger_id,
            UserId: event.user.id,
            UserName: event.user.name,
            Website: website,
            Feedback: feedback,
            ImageUrl: event.original_message.attachments[0].image_url
        }
    }).promise()

    return;
}