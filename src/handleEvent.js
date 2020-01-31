const axios = require('axios');
const { DEFAULT_200_RESPONSE } = require('./constants');
const fetchRedditMeme = require('./fetchRedditMeme');
const createMeme = require('./createMeme');

const { SLACK_ACCESS_TOKEN } = process.env;
const curseRegex = /(fuck|ass|bitch|shit|dick|bastard)/;
const createMemeRegex = /^.+(!create)/g;
const isCreateMeme = (eventText = '') => createMemeRegex.test(eventText);
/* eslint-disable no-console */
// Post message to Slack - https://api.slack.com/methods/chat.postMessage
module.exports = async function handleEvent({ event, authed_users = [] }, callback) {
    const message = {
        channel: event.channel,
    };

    // test default message
    message.text = `<@${event.user}> I AM ALIIIIIIIIIVE`;

    console.log('TCL: handleEvent -> event.text', event.text);
    if (isCreateMeme(event.text)) {
        const createdMeme = await createMeme(event.text);
        console.log('TCL: handleEvent -> createdMeme', createdMeme);
        if (!createdMeme) {
            message.text = ':ohno: Something went wrong :ohno:';
        } else {
            message.text = 'Heres your custom :partydank: meme';
            message.attachments = [
                { title: '', image_url: createdMeme },
            ];
        }
    } else if (event.text.includes('meme')) {
        const removedUsers = authed_users.reduce((finalString, user) => finalString.replace(`<@${user}>`, ''), event.text);
        const sanitizedMessage = removedUsers.replace('meme', '').trim();
        const { text: title, imageUrl } = await fetchRedditMeme(sanitizedMessage);
        if (!title || !imageUrl) {
            console.log('TCL: handleEvent -> title || !imageUrl', title || !imageUrl);
            message.text = `:ohno: Sorry <@${event.user}> couldn't find any memes :ohno:`;
        } else {
            message.text = 'Heres a :partydank: meme';
            message.attachments = [
                { title, image_url: imageUrl },
            ];
        }
    } else if (curseRegex.test(event.text)) {
        message.text = `<@${event.user}> thats very rude, why would you say that?`;
    }

    console.log('TCL: handleEvent -> message', message);

    // const query = qs.stringify(message); // prepare the querystring
    console.log('TCL: handleEvent -> event.channel', event.channel);

    if (event.channel) {
        axios({
            url: 'https://slack.com/api/chat.postMessage',
            method: 'post',
            headers: {
                Authorization: `Bearer ${SLACK_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(message),
        });
    }

    callback(null, DEFAULT_200_RESPONSE);
};
