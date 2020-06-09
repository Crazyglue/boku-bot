require('dotenv').config();

import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import qs from 'querystring';

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
    event_callback: handleEvent
};

/* eslint-disable no-console */
// Lambda handler
exports.handler = (data: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const log = logger.child({ functionName: 'handler' });
    log.info(data.body);
    try {
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
    } catch (e) {
        // Must be an interaction
        // TODO: split lambda into two, one for interaction, one for events
        log.info('Cannot parse json, must be an interaction')
        const decoded: any = qs.decode(data.body);
        log.info('Decoded some data', { decoded });
        const parsedData: SlackAPI.Event = JSON.parse(decoded.payload);
        log.info('Parsed some data', { parsedData });

        handleInteraction(parsedData, callback);
    }
};
