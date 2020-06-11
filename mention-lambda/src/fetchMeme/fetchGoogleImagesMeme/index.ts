import axios from 'axios';
import { SlackAPI } from '../../../../types/slackTypes';
import { Google } from '../../../../types/googleTypes';
import logger from '../../logger';
import removeUsers from '../removeUsers';
import { MEME_FEEDBACK } from '../../constants';
import fetchFeedback from './fetchFeedback';
import selectMeme from './selectMeme';

const { GOOGLE_API_KEY, GOOGLE_SEARCH_ENGINE_ID } = process.env;

const FEEDBACK_ATTACHMENT = {
    "text": "Was this a :dank: meme?",
    "fallback": "You are unable to give feedback on this meme",
    "callback_id": MEME_FEEDBACK.callbackId,
    "color": "#3AA3E3",
    "attachment_type": "default",
    "actions": [
        {
            "name": "feedback",
            "text": ":partydank:",
            "type": "button",
            "value": MEME_FEEDBACK.positiveResponse
        },
        {
            "name": "feedback",
            "text": ":poopmove:",
            "type": "button",
            "value": MEME_FEEDBACK.negativeResponse
        }
    ]
}

async function fetchMemes(searchString: string): Promise<Google.SearchResultItem[]> {
    const res: Google.SearchResult = await axios.get('https://customsearch.googleapis.com/customsearch/v1', {
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

    const memeFeedback = await fetchFeedback();

    log.info('Found feedback', { memeFeedback })

    const { selectedMeme, probability } = selectMeme(memes, memeFeedback);

    log.info(`selectedMeme: ${selectedMeme}`)

    if (!selectedMeme.link) {
        log.child({ selectedMeme }).error('Meme doesnt have a link');
        throw new Error('Meme doesnt have a link');
    }

    const text = `Heres a :partydank: meme from ${selectedMeme.displayLink}\nChance of this meme being selected: ${Math.round(probability * 100)}%`
    const attachments = [
        { title: selectedMeme.title, image_url: selectedMeme.link },
        FEEDBACK_ATTACHMENT
    ]

    return {
        text,
        attachments
    };
}