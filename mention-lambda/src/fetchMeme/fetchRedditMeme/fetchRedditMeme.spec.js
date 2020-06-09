jest.mock('axios', () => ({ get: jest.fn() }));

const axios = require('axios');
import fetchRedditMeme from './index';

import mockResponseData from '../../../../test-data/reddit/sampleAxiosSearchResponse.json';

describe('fetchRedditMeme', () => {
    describe('when a meme can be found', () => {
        beforeAll(() => {
            axios.request = jest.fn().mockResolvedValue(mockResponseData);
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
    })

    describe('when a meme cant be found', () => {
        beforeAll(() => {
            axios.request = jest.fn().mockResolvedValue({
                data: {
                    data: {
                        children: [ { data: {} } ]
                    }
                }
            })
        })

        it('returns a generic error response', async () => {
            const result = await fetchRedditMeme({ text: 'boomer', user: 'HulkHogan' });
            expect(result).toEqual({ text: ':ohno: Sorry <@HulkHogan> couldn\'t find any memes :ohno:' })
        })
    })
});
