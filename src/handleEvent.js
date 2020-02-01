const { DEFAULT_200_RESPONSE } = require('./constants');
const fetchRedditMeme = require('./fetchRedditMeme');
const createMeme = require('./createMeme');
const sendSlackMessage = require('./sendSlackMessage');
const generateHelpResponse = require('./generateHelpResponse');

const curseRegex = /(fuck|ass|bitch|shit|dick|bastard)/;
const isCreateMeme = (eventText = '') => eventText.includes('!create');
const isFetchMeme = (eventText = '') => eventText.toLowerCase().includes('meme');
const isHelp = (eventText = '') => eventText.includes('!help');
/* eslint-disable no-console */
// Post message to Slack - https://api.slack.com/methods/chat.postMessage
module.exports = async function handleEvent({ event, authed_users = [] }, callback) {
    const { channel } = event;

    console.log('TCL: handleEvent -> event.text', event.text);
    if (isCreateMeme(event.text)) {
        const createdMeme = await createMeme(event.text);
        console.log('TCL: handleEvent -> createdMeme', createdMeme);
        if (!createdMeme) {
            const text = ':ohno: Something went wrong :ohno:';
            sendSlackMessage({ text }, channel);
        } else {
            const text = 'Heres your custom :partydank: meme';
            const attachments = [
                { title: '', image_url: createdMeme },
            ];
            sendSlackMessage({ text, attachments }, channel);
        }
    } else if (isHelp(event.text)) {
        const helpResponse = generateHelpResponse(event);
        sendSlackMessage(helpResponse, channel);
    } else if (isFetchMeme(event.text)) {
        const redditMemeResponse = await fetchRedditMeme(event, authed_users);
        sendSlackMessage(redditMemeResponse, channel);
    } else if (curseRegex.test(event.text)) {
        const text = `<@${event.user}> thats very rude, why would you say that?`;
        sendSlackMessage({ text }, channel);
    } else {
        // default message
        const text = `<@${event.user}> I AM ALIIIIIIIIIVE`;
        sendSlackMessage({ text }, channel);
    }

    // response to slack acknowledging the event was received
    callback(null, DEFAULT_200_RESPONSE);
};
