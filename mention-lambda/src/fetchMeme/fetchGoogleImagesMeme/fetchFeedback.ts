import * as AWS from 'aws-sdk';
import logger from '../../logger';

const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.BOKU_MEME_FEEDBACK_TABLE;

interface FeedbackRow {
    Website: string;
    Feedback: 1 | -1;
}

export interface FeedbackMap {
    [key: string]: WebsiteFeedback;
}

export interface WebsiteFeedback {
    domain: string;
    score: number;
    imgCount: number;
    averageImageScore: number;
}

export default async function fetchFeedback(): Promise<WebsiteFeedback[]> {
    const log = logger.child({ functionName: 'fetchFeedback' })
    log.info('Fetching feedback...')
    const allFeedback = await ddb.scan({
        TableName: tableName
    }).promise()

    const items = allFeedback.Items;

    // Iterate over all items, and add up feedback, calculate average, count images.
    const domainFeedbackMap: FeedbackMap = items.reduce((map, item: FeedbackRow) => {
        if (map[item.Website]) {
            map[item.Website].score += item.Feedback;
            map[item.Website].imgCount += 1;
            map[item.Website].averageImageScore = map[item.Website].score / map[item.Website].imgCount;
        } else {
            map[item.Website] = {
                domain: item.Website,
                score: item.Feedback,
                imgCount: 1,
                averageImageScore: item.Feedback
            };
        }
        return map;
    }, {});

    log.info('Found feedback and mapped feedback')

    return Object.values(domainFeedbackMap);
}