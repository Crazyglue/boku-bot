import fetchRedditMeme from './fetchRedditMeme'
import fetchGoogleImagesMeme from './fetchGoogleImagesMeme'
import logger from '../logger';
import { ChatPostMessageArguments } from '@slack/web-api';
import { AppMentionEvent } from '@slack/bolt';

export default async function fetchMeme(event: AppMentionEvent, authedUsers: string[] = []): Promise<ChatPostMessageArguments> {
    const log = logger.child({ event, authedUsers });
    try {
        log.info('fetching via google images')
        return await fetchGoogleImagesMeme(event, authedUsers);
    } catch (e) {
        log.info('fetching via reddit')
        return await fetchRedditMeme(event, authedUsers);
    }
}