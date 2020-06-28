require('dotenv').config();

import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import { DEFAULT_200_RESPONSE } from './constants';

import slackVerification from './slackVerification';
import handleEvent from './handleEvent'
import { SlackAPI, SlackEventHandler } from '../../types/slackTypes';
import logger from './logger';

interface EventHandlerMap {
    [key: string]: SlackEventHandler;
}

const eventToHandler: EventHandlerMap = {
    url_verification: slackVerification,
    event_callback: handleEvent
};

/* eslint-disable no-console */
// Lambda handler
exports.handler = (data: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const log = logger.child({ functionName: 'handler' });
    log.info('Received event', {
        requestContext: data.requestContext,
        context: context,
        headers: data.headers,
    })

    log.info('Responding with default response so slack doesn\'t call again', { DEFAULT_200_RESPONSE });
    callback(null, DEFAULT_200_RESPONSE)

    if (data.headers['X-Slack-Retry-Num']) {
        log.info('Slack is retrying. Returning.')
        return
    }

    const parsedData: SlackAPI.SlackEventPayload = JSON.parse(data.body);

    log.info({ parsedData });

    const handleFn = eventToHandler[parsedData.type];

    log.info({ handleFn });

    if (handleFn) {
        handleFn(parsedData, callback);
    } else {
        // return an error response
        callback(null);
    }
};
