import axios from 'axios';

import { SlackAPI } from './../types/slackTypes';

const { SLACK_ACCESS_TOKEN } = process.env;

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
export default function sendSlackMessage(message: SlackAPI.SlackPost, channel: string = '') {
    if (!channel) {
        return;
    }

    const messageParams = {
        channel,
        ...message,
    };

    axios({
        url: 'https://slack.com/api/chat.postMessage',
        method: 'post',
        headers: {
            Authorization: `Bearer ${SLACK_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(messageParams),
    });
};
