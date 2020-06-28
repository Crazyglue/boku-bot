import deepai from 'deepai';
import logger from '../logger';

deepai.setApiKey(process.env.DEEP_AI_API_KEY);

const TARGET_RESPONSE_LENGTH = 150;

export function trimResponse(originalText: string, text: string): string {
    const trimmedText = text.replace(originalText, '').trim();
    const sentences = trimmedText.split('.') // assume each period is a sentence
    const responseText = [];
    let responseLength = 0;

    while (responseLength < TARGET_RESPONSE_LENGTH && sentences.length > 0) {
        const sentence = sentences.shift();
        responseLength += sentence.length;
        responseText.push(sentence);
    }

    return responseText.join('. ');
}

export default async function createTextResponse(text: string): Promise<string> {
    const log = logger.child({ functionName: 'createTextResponse' });
    const strippedText = text.replace(/\<@.+\>/, '').trim();
    log.info('Hitting DeepAI with', { inputText: strippedText });
    const response = await deepai.callStandardApi("text-generator", {
        text: strippedText,
    });

    log.info('Got response', { response })

    const responseText = trimResponse(strippedText, response.output);

    log.info('Generated a text', { responseText })

    return responseText;
}
