import { WebClient } from '@slack/web-api';

import { SlackAPI } from '../../../types/slackTypes';

const { SLACK_ACCESS_TOKEN } = process.env;

const client = new WebClient(SLACK_ACCESS_TOKEN)

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
export default function sendSlackMessage(message: SlackAPI.SlackPost, channel: string = '') {
    if (!channel) {
        return;
    }

    const messageParams = {
        channel,
        ...message,
    };

    client.chat.postMessage(messageParams);
};
