import fetchRedditMeme from './fetchRedditMeme'
import fetchGoogleImagesMeme from './fetchGoogleImagesMeme'
import { SlackAPI } from '../../../types/slackTypes';
import logger from '../logger';
import { ChatPostMessageArguments } from '@slack/web-api';

export default async function fetchMeme(event: SlackAPI.Event, authedUsers: string[] = []): Promise<ChatPostMessageArguments> {
    const log = logger.child({ event, authedUsers });
    try {
        log.info('fetching via google images')
        return await fetchGoogleImagesMeme(event, authedUsers);
    } catch (e) {
        log.info('fetching via reddit')
        return await fetchRedditMeme(event, authedUsers);
    }
}