import axios from 'axios';

import logger from '../logger';
import { ImageFlip } from '../../../types/imageFlipTypes';

const { IMAGE_FLIP_USERNAME, IMAGE_FLIP_PASSWORD } = process.env;

export function createImageFlipPayload(template: ImageFlip.ImageFlipMemeTemplate, textSnippets: string[]): ImageFlip.ImageFlipCreateParams {
    const log = logger.child({ functionName: 'createImageFlipPayload' });
    const boxes: ImageFlip.ImageFlipBox = textSnippets.reduce((acc, snippet, index) => ({
        ...acc,
        [`boxes[${index}][text]`]: snippet,
    }), {});

    log.info('Sending boxes to ImageFlip', { boxes });

    const imageFlipParams: ImageFlip.ImageFlipCreateParams = {
        template_id: template.id,
        username: IMAGE_FLIP_USERNAME,
        password: IMAGE_FLIP_PASSWORD,
        ...boxes,
    }

    return imageFlipParams;
}

export async function postMemeToImageFlip(template: ImageFlip.ImageFlipMemeTemplate, textSnippets: string[]) {
    const log = logger.child({ functionName: 'postMemeToImageFlip' });

    const imageFlipParams = createImageFlipPayload(template, textSnippets);

    log.info('Creating ImageFlip meme', { imageFlipParams });

    const response = await axios.request<ImageFlip.ImageFlipResponse>({
        url: 'https://api.imgflip.com/caption_image',
        method: 'post',
        params: imageFlipParams,
    }).then(res => res.data);

    log.info('Received Meme from ImageFlip', { response })

    return response;
}