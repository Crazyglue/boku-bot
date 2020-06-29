import { Callback } from 'aws-lambda';
import { ChatPostMessageArguments } from '@slack/web-api';

import { SlackAPI } from '../../../types/slackTypes';
import fetchMeme from '../fetchMeme';
import createMeme from '../createMeme';
import sendSlackMessage from '../api/slack';
import generateHelpResponse from '../commands/generateHelpResponse';
import generateMemeTemplatesResponse from '../commands/generateMemeTemplatesResponse';
import logger from '../logger';
import createTextResponse from '../createTextResponse';
import { generateAiMeme } from '../generateAiMeme';
import { putItem } from '../api/dynamo';

// Check functions
const isCreateMeme = (eventText = ''): boolean => eventText.includes('!create');
const isGenerateAiMeme = (eventText = ''): boolean => eventText.includes('!generate');
const isHelp = (eventText = ''): boolean => eventText.includes('!help');
const isMemeTemplates = (eventText = ''): boolean => eventText.includes('!template');
const isFetchMeme = (eventText = ''): boolean => eventText.toLowerCase().includes('meme');
const isCurseMessage = (eventText = ''): boolean => /(fuck|ass|bitch|shit|dick|bastard)/.test(eventText);

// Response functions (that are one-liners)
const generateCurseResponse = async (event: SlackAPI.Event): Promise<ChatPostMessageArguments> => ({ text: `<@${event.user}> thats very rude, why would you say that?`, channel: event.channel });
const generateDefaultResponse = async (event: SlackAPI.Event): Promise<ChatPostMessageArguments> => ({ text: `<@${event.user}> I tried to think of a response, but I'm too dumb.`, channel: event.channel });

type CheckFunction = (event: string) => boolean;
type EventHandler = (event: SlackAPI.Event) => Promise<ChatPostMessageArguments>;
type EventHandlerTuple = [CheckFunction, EventHandler];

const messageTypeToHandler: EventHandlerTuple[] = [
    [isCreateMeme, createMeme],
    [isGenerateAiMeme, generateAiMeme],
    [isHelp, generateHelpResponse],
    [isMemeTemplates, generateMemeTemplatesResponse],
    [isFetchMeme, fetchMeme],
    [isCurseMessage, generateCurseResponse],
];

const tableName = process.env.DYNAMO_TABLE_NAME;

export default async function handleEvent({ event, ...restProps }: SlackAPI.SlackEventPayload, callback: Callback): Promise<void> {
    const log = logger.child({ functionName: 'handleEvent' });
    const { channel } = event;

    const [ , eventHandler ] = messageTypeToHandler.find(([ check ]) => check(event.text)) || []

    let message: ChatPostMessageArguments;

    if (eventHandler) {
        message = await eventHandler(event);
    } else {
        try {
            message = { text: await createTextResponse(event.text), channel };
        } catch(e) {
            message = await generateDefaultResponse(event);
        }
    }

    try {
        await putItem(tableName, event, message);
    } catch (e) {
        log.info('Cannot save transaction', { error: e });
    }

    log.info('Sending slack message: ', { slackMessage: message });
    sendSlackMessage(message);
};
