import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import qs from 'querystring';

import { SlackAPI } from '../../types/slackTypes';
import logger from './logger';
import handleInteraction from './handleInteraction';

export async function handler(event: APIGatewayProxyEvent, context: Context, callback: Callback) {
    const log = logger.child({ functionName: 'handler' });

    // Must be an interaction
    // TODO: split lambda into two, one for interaction, one for events
    log.info('Cannot parse json, must be an interaction')
    const decoded: any = qs.decode(event.body);
    log.info('Decoded some data', { decoded });
    const parsedData: SlackAPI.Event = JSON.parse(decoded.payload);
    log.info('Parsed some data', { parsedData });

    handleInteraction(parsedData, callback);
}