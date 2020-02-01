jest.mock('./fetchRedditMeme');

const handleEvent = require('./handleEvent');
const fetchRedditMeme = require('./fetchRedditMeme');
const sampleMention = require('../test-data/slack/sampleMention.json');

describe('handleEvent', () => {
    const MOCK_IMAGE_NAME = 'foo-bar';

    beforeAll(() => {
        fetchRedditMeme.mockReturnValue(MOCK_IMAGE_NAME);
    });

    it('santizes a response', async () => {
        await handleEvent(sampleMention, () => {});
        // expect(https.get).toBeCalledWith(expect.any(String));
    });
});
