jest.mock('axios');

const axios = require('axios');
const createMeme = require('./index');

const MOCK_BOKU_MENTION = '<@boku> !create "y u no" "do" "memes"';

describe('createMeme', () => {
    describe('when input text is blank, not provided, or null', () => {
        it('returns null', async () => {
            expect(await createMeme(null)).toEqual(null);
            expect(await createMeme(undefined)).toEqual(null);
            expect(await createMeme('')).toEqual(null);
            expect(await createMeme()).toEqual(null);
        });
    });

    describe('when input text is valid', () => {
        let result;

        describe('when the requested template is in the list', () => {
            const MOCK_URL = 'http://foo.io';

            describe('when the imgflip call is successful', () => {
                beforeAll(async () => {
                    axios.mockResolvedValue({ data: { success: true, data: { url: MOCK_URL } } });
                    result = await createMeme(MOCK_BOKU_MENTION);
                });

                it('returns the meme url', async () => {
                    expect(result).toEqual(MOCK_URL);
                    expect(axios).toHaveBeenCalledWith({
                        url: 'https://api.imgflip.com/caption_image',
                        method: 'post',
                        params: {
                            template_id: '61527',
                            username: undefined,
                            password: undefined,
                            text0: 'do',
                            text1: 'memes',
                        },
                    });
                });
            });

            describe('when the imgflip call is not successful', () => {
                beforeAll(async () => {
                    axios.mockResolvedValue({ data: { success: false } });
                    result = await createMeme(MOCK_BOKU_MENTION);
                });

                it('returns null', async () => {
                    expect(result).toEqual(null);
                    expect(axios).toHaveBeenCalledWith({
                        url: 'https://api.imgflip.com/caption_image',
                        method: 'post',
                        params: {
                            template_id: '61527',
                            username: undefined,
                            password: undefined,
                            text0: 'do',
                            text1: 'memes',
                        },
                    });
                });
            });
        });
    });
});
