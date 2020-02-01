require('dotenv').config();

import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';

import slackVerification from './slackVerification';
import handleEvent from './handleEvent'
import { SlackAPI, SlackEventHandler } from '../types/slackTypes';

interface EventHandlerMap {
    [key: string]: SlackEventHandler;
}

const eventToHandler: EventHandlerMap = {
    url_verification: slackVerification,
    event_callback: handleEvent,
};

/* eslint-disable no-console */
// Lambda handler
exports.handler = (data: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    const parsedData: SlackAPI.SlackEventPayload = JSON.parse(data.body);
    const handleFn = eventToHandler[parsedData.type];

    console.log('processing ', parsedData.type)
    console.log('using data', parsedData)

    if (handleFn) {
        handleFn(parsedData, callback);
    } else {
        // return an error response
        callback(null);
    }
};
