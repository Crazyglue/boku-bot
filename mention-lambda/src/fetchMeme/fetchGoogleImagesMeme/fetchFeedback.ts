import * as AWS from 'aws-sdk';
import logger from '../../logger';

const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.BOKU_MEME_FEEDBACK_TABLE;

interface FeedbackRow {
    Website: string;
    Feedback: 1 | -1;
}

export interface FeedbackMap {
    [key: string]: number;
}

export default async function fetchFeedback(): Promise<FeedbackMap> {
    const log = logger.child({ functionName: 'fetchFeedback' })
    log.info('Fetching feedback...')
    const allFeedback = await ddb.scan({
        TableName: tableName
    }).promise()

    const items = allFeedback.Items;
    // log.info('Found items', { items });

    const domainFeedbackMap = items.reduce((map, item: FeedbackRow) => {
        if (map[item.Website]) {
            map[item.Website] += item.Feedback;
        } else {
            map[item.Website] = item.Feedback;
        }
        return map
    }, {})

    log.info('Found feedback and mapped feedback')

    return domainFeedbackMap;
}