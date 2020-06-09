require('dotenv').config();

import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';

import slackVerification from './slackVerification';
import handleEvent from './handleEvent'
import handleInteraction from './handleInteraction';
import { SlackAPI, SlackEventHandler } from '../types/slackTypes';
import logger from './logger';

interface EventHandlerMap {
    [key: string]: SlackEventHandler;
}

const eventToHandler: EventHandlerMap = {
    url_verification: slackVerification,
    event_callback: handleEvent,
    interactive_message: handleInteraction
};

/* eslint-disable no-console */
// Lambda handler
exports.handler = (data: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const log = logger.child({ functionName: 'handler' });
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
