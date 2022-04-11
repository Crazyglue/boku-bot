require("dotenv").config();

import { App } from '@slack/bolt';
import { MEME_FEEDBACK } from './constants';
import handleEvent from './handleEvent';
import handleMemeFeedback from './handleInteraction/handleMemeFeedback';

const app = new App({
    token: process.env.SLACK_ACCESS_TOKEN, // The bot token, xoxb-...
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

app.event('app_mention', async ({ event, context, client, say }) => {
    const message = await handleEvent(event);
    say(message);
});

app.action(MEME_FEEDBACK.callbackId,  async ({ say, context, action }) => {
  console.log('action', action);
  await handleMemeFeedback(action);
});

(async () => {
    // app.event('app_mention', async (message) => console.log(`Received message: "${message.event.text}"`));
    console.log("Starting bot")
    await app.start(process.env.PORT || 3000)
})()