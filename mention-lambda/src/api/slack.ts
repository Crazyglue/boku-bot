import { WebClient, ChatPostMessageArguments } from '@slack/web-api';

const { SLACK_ACCESS_TOKEN } = process.env;

const client = new WebClient(SLACK_ACCESS_TOKEN)

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
export default function sendSlackMessage(message: ChatPostMessageArguments) {
    client.chat.postMessage(message);
};
