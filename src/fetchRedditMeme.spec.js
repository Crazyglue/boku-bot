jest.mock('axios', () => ({ get: jest.fn() }));

const axios = require('axios');
const fetchRedditMeme = require('./fetchRedditMeme');

const mockResponseData = require('../test-data/reddit/sampleAxiosSearchResponse.json');

describe('fetchRedditMeme', () => {
    beforeAll(() => {
        axios.get.mockResolvedValue(mockResponseData);
    });

    it('fetches memes', async () => {
        const result = await fetchRedditMeme({ text: 'boomer' });
        expect(result).toEqual({
            text: expect.any(String),
            attachments: [
                { image_url: expect.any(String), title: expect.any(String) },
            ],
        });
    });
});
