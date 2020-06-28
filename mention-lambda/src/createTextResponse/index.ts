import deepai from 'deepai';
import logger from '../logger';
import { fetchAiText } from '../api';

deepai.setApiKey(process.env.DEEP_AI_API_KEY);

const TARGET_RESPONSE_LENGTH = 150;

export function trimResponse(originalText: string, text: string): string {
    const trimmedText = text.replace(originalText, '').trim();
    const sentences = trimmedText.split('.') // assume each period is a sentence
    const responseText = [];
    let responseLength = 0;

    while (responseLength < TARGET_RESPONSE_LENGTH && sentences.length > 0) {
        const sentence = sentences.shift().trim();
        responseLength += sentence.length;
        responseText.push(sentence);
    }

    return responseText.join('. ');
}

export default async function createTextResponse(text: string): Promise<string> {
    const log = logger.child({ functionName: 'createTextResponse' });

    // Strip out user names
    const strippedText = text.replace(/\<@.+\>/g, '').trim()
    const responseText = await fetchAiText(strippedText);

    const trimmedText = trimResponse(strippedText, responseText);

    log.info('Generated a text', { trimmedText })

    return trimmedText;
}
