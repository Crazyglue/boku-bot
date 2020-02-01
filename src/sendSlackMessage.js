const axios = require('axios');

const { SLACK_ACCESS_TOKEN } = process.env;

module.exports = function sendSlackMessage(message = {}, channel = null) {
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