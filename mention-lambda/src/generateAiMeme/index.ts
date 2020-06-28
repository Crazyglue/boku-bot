import { fetchAiText } from '../api/deepai';
import memeTemplates from '../createMeme/memeTemplates.json';
import { ImageFlip } from '../../../types/imageFlipTypes';
import { postMemeToImageFlip } from '../api';
import logger from '../logger';
import { SlackAPI } from '../../../types/slackTypes';

const TOP_TEXT_WORD_COUNT = 5;
const OTHER_TEXT_WORD_COUNT = 10;
const ERROR_MESSAGE = { text: ':ohno: I\'m too dumb and couldn\'t make a meme for you :ohno:' };

function getRandomIndex(length: number = 0) {
    return Math.floor(Math.random() * length);
}

export async function generateAiMeme({ text: fullText }: SlackAPI.Event): Promise<SlackAPI.SlackPost> {
    const log = logger.child({ functionName: 'generateAiMeme' });
    const aiText = await fetchAiText(fullText);

    const randomTemplate: ImageFlip.ImageFlipMemeTemplate = memeTemplates[getRandomIndex(memeTemplates.length)];

    const topTextCandidates = aiText.split('.').filter(t => t.split(' ').length <= TOP_TEXT_WORD_COUNT);
    const otherTextCandidates = aiText.split('.').filter(t => t.split(' ').length <= OTHER_TEXT_WORD_COUNT);


    const topText = topTextCandidates[getRandomIndex(topTextCandidates.length)]
    const otherText: string[] = [];
    while (otherText.length < randomTemplate.box_count - 1 && otherTextCandidates.length > 0) {
        const [ text ] = otherTextCandidates.splice(getRandomIndex(otherTextCandidates.length), 1);
        otherText.push(text);
    }

    const response = await postMemeToImageFlip(randomTemplate, [ topText, ...otherText ]);

    if (response.success) {
        log.info('Successfully created a meme!', { response })
        const successText = `I created this :partydank: meme`;
        const attachments = [
            { title: '', image_url: response.data.url },
        ];

        return {
            text: successText,
            attachments,
        };
    }

    log.info('Response from ImageFlip wasnt successful', { response });
    return ERROR_MESSAGE;
}