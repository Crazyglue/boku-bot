import axios from 'axios';
import { SlackAPI } from '../../../types/slackTypes';
import logger from '../../logger';
import removeUsers from '../removeUsers';

const { GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } = process.env;


async function fetchMemes(searchString: string) {
    const res = await axios.get('https://customsearch.googleapis.com/customsearch/v1', {
        params: {
            key: GOOGLE_API_KEY,
            q: searchString,
            searchType: 'image',
            cx: GOOGLE_SEARCH_ENGINE_ID
        }
    })

    return res.data.items;
}

export default async function fetchGoogleImagesMeme(event: SlackAPI.Event, authedUsers: string[] = []): Promise<SlackAPI.SlackPost> {
    const log = logger.child({ event, authedUsers, function: 'fetchGoogleImagesMeme' });
    const sanitizedMessage = removeUsers(event.text)

    log.info(`sanitizedMessage: ${sanitizedMessage}`);

    const memes = await fetchMemes(sanitizedMessage);
    if (memes.length === 0) {
        log.error('No memes found using google search');
        throw new Error('No memes found from google');
    }

    const randomIndex = Math.floor(Math.random() * memes.length);
    const selectedMeme = memes[randomIndex];

    log.info(`selectedMeme: ${selectedMeme}`)

    if (!selectedMeme.link) {
        log.child({ selectedMeme }).error('Meme doesnt have a link');
        throw new Error('Meme doesnt have a link');
    }

    const text = `Heres a :partydank: meme from ${selectedMeme.displayLink}`
    const attachments = [
        { title: selectedMeme.title, image_url: selectedMeme.link }
    ]

    return {
        text,
        attachments
    };
}