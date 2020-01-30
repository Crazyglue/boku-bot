const handleEvent = require('./handleEvent');
const sampleMention = require('../test-data/slack/sampleMention.json');

describe('handleEvent', () => {
    it('santizes a response', async () => {
        const result = await handleEvent(sampleMention, () => {});
        expect(result).toEqual({});
    });
});
