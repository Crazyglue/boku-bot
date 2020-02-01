module.exports = function generateHelpResponse({ user }) {
    const responseText = `<@${user}> You can interact with me in a number of ways:`;
    const blocks = [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: [
                    responseText,
                    '• Searching reddit for a meme - `@boku <any text> meme`',
                    '• Generating a meme - `@boku !create "<template name>" "text box 1" "text box 2" "..."`',
                    '• Checking if I\'m alive - `@boku <any text>`',
                ].join('\n'),
            },
        },
    ];

    return {
        blocks,
    };
};
