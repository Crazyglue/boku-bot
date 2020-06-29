import { ChatPostMessageArguments } from '@slack/web-api';
import { SlackAPI } from '../../../types/slackTypes';

export default async function generateHelpResponse({ user, channel }: SlackAPI.Event): Promise<ChatPostMessageArguments> {
    const responseText = `<@${user}> You can interact with me in a number of ways:`;
    const blockText = [
        responseText,
        '• Searching reddit for a meme - `@boku <any text> meme`',
        '• Generating a meme - `@boku !create "<template name>" "text box 1" "text box 2" "..."`',
        '• Checking if I\'m alive - `@boku <any text>`',
    ].join('\n');
    const blocks: SlackAPI.Block[] = [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: blockText,
            },
        },
    ];

    return {
        text: '',
        channel,
        blocks,
    };
};
