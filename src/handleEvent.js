const https = require('https');
const qs = require('querystring');
const { DEFAULT_200_RESPONSE } = require('./constants');
const fetchRedditMeme = require('./fetchRedditMeme');

const { SLACK_ACCESS_TOKEN } = process.env;
const curseRegex = /(fuck|ass|bitch|shit|dick|bastard)/;
/* eslint-disable no-console */
// Post message to Slack - https://api.slack.com/methods/chat.postMessage
module.exports = async function handleEvent({ event, authed_users = [] }, callback) {
    // test default message
    let text = `<@${event.user}> I AM ALIIIIIIIIIVE`;

    console.log('TCL: handleEvent -> event.text', event.text);
    if (event.text.includes('meme')) {
        const removedUsers = authed_users.reduce((finalString, user) => finalString.replace(`<@${user}>`, ''), event.text);
        const sanitizedMessage = removedUsers.replace('meme', '').trim();
        text = await fetchRedditMeme(sanitizedMessage);
    } else if (curseRegex.test(event.text)) {
        text = `<@${event.user}> thats very rude, why would you say that?`;
    }

    const message = {
        token: SLACK_ACCESS_TOKEN,
        channel: event.channel,
        text,
    };

    console.log('TCL: handleEvent -> text', text);

    const query = qs.stringify(message); // prepare the querystring

    if (event.channel) {
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    callback(null, DEFAULT_200_RESPONSE);
};
