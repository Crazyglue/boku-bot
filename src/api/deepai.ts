import deepai from 'deepai';

interface DeepAIResponse {
    output: string;
    id: string;
    err?: string;
}
import logger from '../logger';

deepai.setApiKey(process.env.DEEP_AI_API_KEY)

export async function fetchAiText(text: string): Promise<DeepAIResponse> {
    const log = logger.child({ functionName: 'createTextResponse' });

    log.info('Hitting DeepAI with', { inputText: text });
    const response = await deepai.callStandardApi("text-generator", {
        text
    });

    log.info('Got response', { response })

    return response;
}
