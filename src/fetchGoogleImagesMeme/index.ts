import axios from 'axios';
import { SlackAPI } from '../../types/slackTypes';

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
    const removedUsers = authedUsers.reduce((finalString, user) => finalString.replace(`<@${user}>`, ''), event.text);
    const sanitizedMessage = removedUsers.trim();

    const memes = await fetchMemes(sanitizedMessage);
    if (memes.length === 0) {
        throw new Error('No memes found from google');
    }

    const randomIndex = Math.floor(Math.random() * memes.length);
    const selectedMeme = memes[randomIndex];

    const text = `Heres a :partydank: meme from ${selectedMeme.displayLink}`
    const attachments = [
        { title: selectedMeme.title, image_url: selectedMeme.link }
    ]

    return {
        text,
        attachments
    };
}