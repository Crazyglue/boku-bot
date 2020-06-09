import { Callback } from "aws-lambda";

import { SlackAPI } from "../../../types/slackTypes";
import handleMemeFeedback from './handleMemeFeedback';
import { MEME_FEEDBACK } from '../constants';
import logger from '../logger';

const INTERACTION_HANDLER_MAP = {
    [MEME_FEEDBACK.callbackId]: handleMemeFeedback
}

export default async function handleInteraction(event: SlackAPI.ActionEvent, callback: Callback) {
    const log = logger.child({ function: 'handleInteraction' })
    const handlerFunction = INTERACTION_HANDLER_MAP[event.callback_id]

    log.info(`Found function: ${handlerFunction}`);

    if (handlerFunction) {
        await handlerFunction(event);
    } else {
        log.info(`Function for event ${event.callback_id} not found, not handling interaction.`)
    }

}