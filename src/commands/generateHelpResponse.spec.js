import generateHelpResponse from './generateHelpResponse';

describe('generateHelpResponse', () => {
    it('creates a propertly formatted slack message', async () => {
        const result = await generateHelpResponse({ user: 'HulkHogan', channel: 'ds-devops' })
        expect(result).toEqual({
            text: '',
            channel: 'ds-devops',
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '<@HulkHogan> You can interact with me in a number of ways:\n• Searching reddit for a meme - `@boku <any text> meme`\n• Generating a meme - `@boku !create \"<template name>\" \"text box 1\" \"text box 2\" \"...\"`\n• Checking if I\'m alive - `@boku <any text>`'
                    }
                }
            ]
        })
    })
})