const https = require('https');
const qs = require('querystring');
const { DEFAULT_200_RESPONSE } = require('./constants');

const { SLACK_ACCESS_TOKEN } = process.env;
const curseRegex = /(fuck|ass|bitch|shit|dick|bastard)/;
/* eslint-disable no-console */
// Post message to Slack - https://api.slack.com/methods/chat.postMessage
module.exports = function handleEvent({ event }, callback) {
    console.log('event', event);

    console.log('SLACK_ACCESS_TOKEN', SLACK_ACCESS_TOKEN);

    // test the message for a match and not a bot
    let text = `<@${event.user}> I AM ALIIIIIIIIIVE`;

    if (curseRegex.test(event.text)) {
        text = `<@${event.user}> thats very rude, why would you say that?`;
    }
    const message = {
        token: SLACK_ACCESS_TOKEN,
        channel: event.channel,
        text,
    };

    console.log('message', message);

    const query = qs.stringify(message); // prepare the querystring
    console.log('stringified query, ', query);
    https.get(`https://slack.com/api/chat.postMessage?${query}`);

    console.log('sent response...');

    callback(null, DEFAULT_200_RESPONSE);
};
