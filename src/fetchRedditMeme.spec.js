const fetchRedditMeme = require('./fetchRedditMeme');

describe('fetchRedditMeme', () => {
    it('fetches memes', async () => {
        const result = await fetchRedditMeme('boomer');
        expect(result).toEqual({});
    });
});
