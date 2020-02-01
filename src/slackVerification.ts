import { Callback } from "aws-lambda";

import { SlackAPI } from './../types/slackTypes';
import constants from './constants';

const { SLACK_VERIFICATION_TOKEN } = process.env;

// Verify Url - https://api.slack.com/events/url_verification
export default function verify(data: SlackAPI.SlackEventPayload, callback: Callback) {
    if (data.token === SLACK_VERIFICATION_TOKEN) {
        const body = JSON.stringify({ challenge: data.challenge });
        callback(null, {
            ...constants.DEFAULT_200_RESPONSE,
            body,
        });
    } else callback('verification failed');
};
