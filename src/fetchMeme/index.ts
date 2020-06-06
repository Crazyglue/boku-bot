import fetchRedditMeme from '../fetchRedditMeme'
import fetchGoogleImagesMeme from '../fetchGoogleImagesMeme'
import { SlackAPI } from '../../types/slackTypes';

export default async function fetchMeme(event: SlackAPI.Event, authedUsers: string[] = []): Promise<SlackAPI.SlackPost> {
    try {
        return await fetchGoogleImagesMeme(event, authedUsers);
    } catch (e) {
        return await fetchRedditMeme(event, authedUsers);
    }
}