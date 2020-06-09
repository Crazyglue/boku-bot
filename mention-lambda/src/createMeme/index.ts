import axios from 'axios';
import FuzzySearch from 'fuzzy-search';

import { ImageFlip } from '../../../types/imageFlipTypes';
import { SlackAPI } from "../../../types/slackTypes";
import memeTable from './memeTemplates.json';
import parseInputText from './parseInputText';

const { IMAGE_FLIP_USERNAME, IMAGE_FLIP_PASSWORD } = process.env;

const searcher = new FuzzySearch<ImageFlip.ImageFlipMemeTemplate>(memeTable, ['name'], {
    caseSensitive: false,
});

export const ERROR_MESSAGE = { text: ':ohno: Something went wrong :ohno:' };

export default async function createMeme({ text = '' }: SlackAPI.Event): Promise<SlackAPI.SlackPost> {
    if (!text || text.length === 0) {
        return ERROR_MESSAGE;
    }

    const [templateName, ...textValues] = parseInputText(text);

    const [ template ] = searcher.search(templateName);

    if (!template) {
        return {
            text: `Sorry, couldnt find a meme template for: ${text}`
        }
    }

    const boxes: ImageFlip.ImageFlipBox = textValues.reduce((acc, snippet, index) => ({
        ...acc,
        [`boxes[${index}][text]`]: snippet,
    }), {});

    console.log('TCL: boxes', boxes);

    const imageFlipParams: ImageFlip.ImageFlipCreateParams = {
        template_id: template.id,
        username: IMAGE_FLIP_USERNAME,
        password: IMAGE_FLIP_PASSWORD,
        ...boxes,
    }

    const response = await axios.request<ImageFlip.ImageFlipResponse>({
        url: 'https://api.imgflip.com/caption_image',
        method: 'post',
        params: imageFlipParams,
    }).then(res => res.data);

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
    return ERROR_MESSAGE;
};
