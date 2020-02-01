import { SlackAPI } from './../types/slackTypes';
import memeTemplates from './createMeme/memeTemplates.json';

interface MemeTemplate {
    id: string;
    name: string;
    box_count: number;
}

module.exports = function generateMemeTemplatesResponse({ user }: SlackAPI.Event): SlackAPI.SlackPost {
    const titleText = `<@${user}> here are some meme templates along with how many boxes they have.`;
    const subText = 'Heres an example for `Drake Hotline Bling (2)`';
    const example = '`@boku !create "Drake Hotline Bling" "Memorizing all the meme templates" "Letting boku tell you the templates"`';

    /* eslint-disable-next-line camelcase */
    const templateNames = (memeTemplates as MemeTemplate[]).map(({ name, box_count }) => `\`${name} (${box_count})\``).join(' - ');
    const message = {
        text: [
            titleText,
            subText,
            example,
        ].join('\n'),
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
