import FuzzySearch from 'fuzzy-search';

import { postMemeToImageFlip } from '../api';
import { ImageFlip } from '../../../types/imageFlipTypes';
import { SlackAPI } from "../../../types/slackTypes";
import memeTable from './memeTemplates.json';
import parseInputText from './parseInputText';
import logger from '../logger';

const searcher = new FuzzySearch<ImageFlip.ImageFlipMemeTemplate>(memeTable, ['name'], {
    caseSensitive: false,
});

export const ERROR_MESSAGE = { text: ':ohno: Something went wrong :ohno:' };

export default async function createMeme({ text = '' }: SlackAPI.Event): Promise<SlackAPI.SlackPost> {
    const log = logger.child({ functionName: 'createMeme' })
    if (!text || text.length === 0) {
        log.info('No text, cannot create meme.')
        return ERROR_MESSAGE;
    }

    const [templateName, ...textValues] = parseInputText(text);

    const [ template ] = searcher.search(templateName);

    if (!template) {
        return {
            text: `Sorry, couldnt find a meme template for: ${text}`
        }
    }

    const response = await postMemeToImageFlip(template, textValues);

    if (response.success) {
        const successText = `Heres your :partydank: meme`;
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
};
