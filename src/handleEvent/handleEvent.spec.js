jest.mock('../fetchRedditMeme');

import handleEvent from './index';
import fetchRedditMeme from '../fetchRedditMeme';

import sampleMention from '../../test-data/slack/sampleMention.json';

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