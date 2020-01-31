const https = require('https');
const qs = require('qs');
const { DEFAULT_200_RESPONSE } = require('./constants');
const fetchRedditMeme = require('./fetchRedditMeme');

const { SLACK_ACCESS_TOKEN } = process.env;
const curseRegex = /(fuck|ass|bitch|shit|dick|bastard)/;
/* eslint-disable no-console */
// Post message to Slack - https://api.slack.com/methods/chat.postMessage
module.exports = async function handleEvent({ event, authed_users = [] }, callback) {
    const message = {
        token: SLACK_ACCESS_TOKEN,
        channel: event.channel,
    };

    // test default message
    message.text = `<@${event.user}> I AM ALIIIIIIIIIVE`;

    console.log('TCL: handleEvent -> event.text', event.text);
    if (event.text.includes('meme')) {
        const removedUsers = authed_users.reduce((finalString, user) => finalString.replace(`<@${user}>`, ''), event.text);
        const sanitizedMessage = removedUsers.replace('meme', '').trim();
        const { text: title, imageUrl } = await fetchRedditMeme(sanitizedMessage);
        if (!title || !imageUrl) {
            message.text = `:ohno: Sorry <@${event.user}> couldn't find any memes :ohno:`;
        }
        message.text = `:party_dank: ${title} :party_dank: \n${imageUrl}`;
    } else if (curseRegex.test(event.text)) {
        message.text = `<@${event.user}> thats very rude, why would you say that?`;
    }

    const query = qs.stringify(message); // prepare the querystring

    if (event.channel) {
        https.get(`https://slack.com/api/chat.postMessage?${query}`);
    }

    callback(null, DEFAULT_200_RESPONSE);
};
