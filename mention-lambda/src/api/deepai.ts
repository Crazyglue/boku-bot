import deepai from 'deepai';

import logger from '../logger';

export async function fetchAiText(text: string): Promise<string> {
    const log = logger.child({ functionName: 'createTextResponse' });

    log.info('Hitting DeepAI with', { inputText: text });
    const response = await deepai.callStandardApi("text-generator", {
        text
    });

    log.info('Got response', { response })

    return response.output;
}
