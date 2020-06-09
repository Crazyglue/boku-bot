import { Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

import { SlackAPI } from '../../../types/slackTypes';
import { DEFAULT_200_RESPONSE } from '../constants';
import fetchMeme from '../fetchMeme';
import createMeme from '../createMeme';
import sendSlackMessage from '../sendSlackMessage';
import generateHelpResponse from '../commands/generateHelpResponse';
import generateMemeTemplatesResponse from '../commands/generateMemeTemplatesResponse';

// Check functions
const isCreateMeme = (eventText = ''): boolean => eventText.includes('!create');
const isHelp = (eventText = ''): boolean => eventText.includes('!help');
const isMemeTemplates = (eventText = ''): boolean => eventText.includes('!template');
const isFetchMeme = (eventText = ''): boolean => eventText.toLowerCase().includes('meme');
const isCurseMessage = (eventText = ''): boolean => /(fuck|ass|bitch|shit|dick|bastard)/.test(eventText);

// Response functions (that are one-liners)
const generateCurseResponse = async (event: SlackAPI.Event): Promise<SlackAPI.SlackPost> => ({ text: `<@${event.user}> thats very rude, why would you say that?` });
const generateDefaultResponse = async (event: SlackAPI.Event): Promise<SlackAPI.SlackPost> => ({ text: `<@${event.user}> I AM ALIIIIIIIIIVE` });

type CheckFunction = (event: string) => boolean;

type EventHandler = (event: SlackAPI.Event, authed_users?: string[]) => Promise<SlackAPI.SlackPost>;

type EventHandlerTuple = [CheckFunction, EventHandler];

const messageTypeToHandler: EventHandlerTuple[] = [
    [isCreateMeme, createMeme],
    [isHelp, generateHelpResponse],
    [isMemeTemplates, generateMemeTemplatesResponse],
    [isFetchMeme, fetchMeme],
    [isCurseMessage, generateCurseResponse],
];

const tableName = process.env.DYNAMO_TABLE_NAME;

const ddb = new AWS.DynamoDB.DocumentClient();

/* eslint-disable no-console */
export default async function handleEvent({ event, authed_users = [], ...restProps }: SlackAPI.SlackEventPayload, callback: Callback): Promise<void> {
    // response to slack acknowledging the event was received
    callback(null, DEFAULT_200_RESPONSE);

    const { channel } = event;

    const [ , eventHandler ] = messageTypeToHandler.find(([ check ]) => check(event.text)) || []

    let message;

    if (eventHandler) {
        message = await eventHandler(event, authed_users);
    } else {
        message = await generateDefaultResponse(event);
    }

    try {
        await ddb.put({
            TableName: tableName,
            Item: {
                SlackMessageId: restProps.event_id,
                Text: event.text,
                Channel: event.channel,
                User: event.user,
                ReponseText: message.text,
                ResponseAttachments: JSON.stringify(message.attachments)
            }
        }).promise()
    } catch (e) {
        console.log('cannot save transaction');
    }

    console.log('Sending slack message: ', message);
    sendSlackMessage(message, channel);

};
