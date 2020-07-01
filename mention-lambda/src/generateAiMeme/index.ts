import { ChatPostMessageArguments } from '@slack/web-api';
import { fetchAiText } from '../api/deepai';
import memeTemplates from '../createMeme/memeTemplates.json';
import { ImageFlip } from '../../../types/imageFlipTypes';
import { postMemeToImageFlip } from '../api';
import logger from '../logger';
import { SlackAPI } from '../../../types/slackTypes';

const TOP_TEXT_WORD_COUNT = 5;
const OTHER_TEXT_WORD_COUNT = 10;
const MINIMUM_WORD_COUNT = 3;
const MAXIMUM_TOTAL_SENTENCE_LENGTH = 50;
const ERROR_MESSAGE = { text: ':ohno: I\'m too dumb and couldn\'t make a meme for you :ohno:' };

function getRandomIndex(length: number = 0) {
    return Math.floor(Math.random() * length);
}

const TOP_TEXT_FILTERS = [
    (sentence: string) => sentence.split(' ').length <= TOP_TEXT_WORD_COUNT,
    (sentence: string) => sentence.split(' ').length >= MINIMUM_WORD_COUNT,
    (sentence: string) => sentence.length <= MAXIMUM_TOTAL_SENTENCE_LENGTH,
]

const OTHER_TEXT_FILTERS = [
    (sentence: string) => sentence.split(' ').length <= OTHER_TEXT_WORD_COUNT,
    (sentence: string) => sentence.split(' ').length >= MINIMUM_WORD_COUNT,
    (sentence: string, topText: string[]) => !topText.includes(sentence),
    (sentence: string) => sentence.length <= MAXIMUM_TOTAL_SENTENCE_LENGTH,
]

export async function generateAiMeme({ text: fullText, channel }: SlackAPI.Event): Promise<ChatPostMessageArguments> {
    const log = logger.child({ functionName: 'generateAiMeme' });
    const requestText = fullText.replace(/<@.+>/g, '');  // remove boku user
    const { output: aiText, ...deepAiResponse } = await fetchAiText(requestText);

    if (deepAiResponse.err) {
        log.info('Error fetching text from DeepAI', { ...deepAiResponse, aiText })
        return {
            ...ERROR_MESSAGE,
            attachments: [
                { text: deepAiResponse.err }
            ],
            channel
        }
    }

    // Clean up string and get sentences
    const sentences = aiText
        .replace(requestText, '') // remove the text that initiated the request
        .replace(/\<.*?\>/g, '') // remove all tags
        .replace(/\<\|endoftext\|\>/g, ' ') // remove NN stuff
        .split(/[\.\?\!\n]\s/) // split into setences
        .map(sentence => sentence.trim()).filter(Boolean); // trim and remove empty strings

    log.info('Filtered down the sentences', { sentences });

    const randomTemplate: ImageFlip.ImageFlipMemeTemplate = memeTemplates[getRandomIndex(memeTemplates.length)];

    // Find candidates for each text field
    const topTextCandidates = TOP_TEXT_FILTERS.reduce((remainingSentences, filterFn) => remainingSentences.filter(filterFn), sentences)
    const otherTextCandidates = OTHER_TEXT_FILTERS.reduce((remaining, filterFn) => remaining.filter((r) => filterFn(r, topTextCandidates)), sentences);

    log.info('Found the following candidates', { topTextCandidates, otherTextCandidates });

    const topText = topTextCandidates[getRandomIndex(topTextCandidates.length)]
    const otherText: string[] = [];
    while (otherText.length < randomTemplate.box_count - 1 && otherTextCandidates.length > 0) {
        const [ text ] = otherTextCandidates.splice(getRandomIndex(otherTextCandidates.length), 1);
        otherText.push(text);
    }

    const response = await postMemeToImageFlip(randomTemplate, [ topText, ...otherText ]);

    if (response.success) {
        log.info('Successfully created a meme!', { response })
        return {
            text: `I created this :partydank: meme`,
            attachments: [
                { title: '', image_url: response.data.url },
            ],
            channel
        };
    }

    log.info('Response from ImageFlip wasnt successful', { response });
    return {
        ...ERROR_MESSAGE,
        channel,
    };
}