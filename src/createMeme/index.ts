import { SlackAPI } from "./../../types/slackTypes";

import axios from 'axios';
import memeTable from './memeTemplates.json';
import parseInputText from './parseInputText';

const { IMAGE_FLIP_USERNAME, IMAGE_FLIP_PASSWORD } = process.env;

export const ERROR_MESSAGE = { text: ':ohno: Something went wrong :ohno:' };

interface ImageFlipResponse {
    success: boolean;
    data: {
        url: string;
    }
}

interface ImageFlipCreateParams {
    template_id: string;
    username: string;
    password: string;
    text0?: string;
    text1?: string;
}

interface ImageFlipBox {
    [key: string]: string;
}

export default async function createMeme({ text = '', user }: SlackAPI.Event): Promise<SlackAPI.SlackPost> {
    if (!text || text.length === 0) {
        return ERROR_MESSAGE;
    }

    const [templateName, ...textValues] = parseInputText(text);

    const template = memeTable.find((memeTemplate) => memeTemplate.name.toLowerCase() === templateName.toLowerCase());

    const boxes: ImageFlipBox = textValues.reduce((acc, snippet, index) => ({
        ...acc,
        [`boxes[${index}][text]`]: snippet,
    }), {});

    console.log('TCL: boxes', boxes);

    const imageFlipParams: ImageFlipCreateParams = {
        template_id: template.id,
        username: IMAGE_FLIP_USERNAME,
        password: IMAGE_FLIP_PASSWORD,
        ...boxes,
    }

    const response = await axios.request<ImageFlipResponse>({
        url: 'https://api.imgflip.com/caption_image',
        method: 'post',
        params: imageFlipParams,
    }).then(res => res.data);

    if (response.success) {
        const successText = `<@${user}> 's :partydank: meme`;
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
