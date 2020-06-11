import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import qs from 'querystring';

import { SlackAPI } from '../../types/slackTypes';
import logger from './logger';
import handleInteraction from './handleInteraction';

export async function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
    const log = logger.child({ functionName: 'handler', event });

    // Must be an interaction
    // TODO: split lambda into two, one for interaction, one for events
    log.info('Handling interaction')
    const decoded: any = qs.decode(event.body);
    log.info('Decoded some data', { decoded });
    const parsedData: SlackAPI.ActionEvent = JSON.parse(decoded.payload);
    log.info('Parsed some data', { parsedData });

    const result = await handleInteraction(parsedData);

    return {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {},
        body: JSON.stringify(result)
    }
}