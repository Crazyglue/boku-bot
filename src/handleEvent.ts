import { SlackAPI } from '../types/slackTypes';
import { Callback } from 'aws-lambda';

const { DEFAULT_200_RESPONSE } = require('./constants');
const fetchRedditMeme = require('./fetchRedditMeme');
const createMeme = require('./createMeme');
const sendSlackMessage = require('./sendSlackMessage');
const generateHelpResponse = require('./generateHelpResponse');
const generateMemeTemplatesResponse = require('./generateMemeTemplatesResponse');

// Check functions
const isCreateMeme = (eventText = '') => eventText.includes('!create');
const isHelp = (eventText = '') => eventText.includes('!help');
const isMemeTemplates = (eventText = '') => eventText.includes('!template');
const isFetchMeme = (eventText = '') => eventText.toLowerCase().includes('meme');
const isCurseMessage = (eventText = '') => /(fuck|ass|bitch|shit|dick|bastard)/.test(eventText);

// Response functions (that are one-liners)
const generateCurseResponse = (event: SlackAPI.Event) => ({ text: `<@${event.user}> thats very rude, why would you say that?` });
const generateDefaultResponse = (event: SlackAPI.Event) => ({ text: `<@${event.user}> I AM ALIIIIIIIIIVE` });

const messageTypeToHandler = [
    [isCreateMeme, createMeme],
    [isHelp, generateHelpResponse],
    [isMemeTemplates, generateMemeTemplatesResponse],
    [isFetchMeme, fetchRedditMeme],
    [isCurseMessage, generateCurseResponse],
];

/* eslint-disable no-console */
export default async function handleEvent({ event, authed_users = [] }: SlackAPI.SlackEventPayload, callback: Callback): Promise<void> {
    const { channel } = event;

    const eventHandler = messageTypeToHandler.reduce((handler, [checkFn, handlerFn]) => {
        if (handler) {
            return handler;
        }

        if (checkFn(event.text)) {
            return handlerFn;
        }

        return handler;
    }, null);

    let message;

    if (eventHandler) {
        message = await eventHandler(event, authed_users);
    } else {
        message = await generateDefaultResponse(event);
    }

    console.log('TCL: handleEvent -> message', message);
    sendSlackMessage(message, channel);

    // response to slack acknowledging the event was received
    callback(null, DEFAULT_200_RESPONSE);
};
