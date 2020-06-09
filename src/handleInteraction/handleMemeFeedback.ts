import { SlackAPI } from '../../types/slackTypes';
import logger from '../logger';

export default async function handleMemeFeedback(event: SlackAPI.Event): Promise<void> {
    const log = logger.child({ function: 'handleMemeFeedback', event });

    log.info('Handling meme feedback...')

    return;
}