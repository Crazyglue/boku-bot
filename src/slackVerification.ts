import { Callback } from "aws-lambda";

import { SlackAPI } from './../types/slackTypes';
import { DEFAULT_200_RESPONSE } from './constants';

const { SLACK_VERIFICATION_TOKEN } = process.env;

// Verify Url - https://api.slack.com/events/url_verification
export default async function verify(data: SlackAPI.SlackEventPayload, callback: Callback): Promise<void> {
    if (data.token === SLACK_VERIFICATION_TOKEN) {
        const body = JSON.stringify({ challenge: data.challenge });
        callback(null, {
            ...DEFAULT_200_RESPONSE,
            body,
        });
    } else callback('verification failed');
};
