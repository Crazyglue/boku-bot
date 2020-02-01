const memeTemplates = require('./createMeme/memeTemplates.json');

module.exports = function generateMemeTemplatesResponse(event) {
    const templateNames = memeTemplates.map(({ name }) => name).join(' - ');
    const message = {
        attachments: [
            {
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: templateNames,
                        },
                    },
                ],
            },
        ],
    };

    return message;
};
