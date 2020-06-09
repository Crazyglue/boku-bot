import { SlackAPI } from '../../../types/slackTypes';

export default async function generateHelpResponse({ user }: SlackAPI.Event): Promise<SlackAPI.SlackPost> {
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
        blocks,
    };
};
