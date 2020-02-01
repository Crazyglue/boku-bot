jest.mock('axios');

const axios = require('axios');
const createMeme = require('./index');

const MOCK_BOKU_MENTION = '<@boku> !create "y u no" "do" "memes"';

describe('createMeme', () => {
    describe('when input text is blank, not provided, or null', () => {
        it('returns null', async () => {
            expect(await createMeme({ text: null })).toEqual(createMeme.ERROR_MESSAGE);
            expect(await createMeme({})).toEqual(createMeme.ERROR_MESSAGE);
            expect(await createMeme({ text: '' })).toEqual(createMeme.ERROR_MESSAGE);
            expect(await createMeme()).toEqual(createMeme.ERROR_MESSAGE);
        });
    });

    describe('when input text is valid', () => {
        let result;

        describe('when the requested template is in the list', () => {
            const MOCK_URL = 'http://foo.io';

            describe('when the imgflip call is successful', () => {
                beforeAll(async () => {
                    axios.mockResolvedValue({ data: { success: true, data: { url: MOCK_URL } } });
                    result = await createMeme({ text: MOCK_BOKU_MENTION, user: 'abc' });
                });

                it('returns the meme url', async () => {
                    expect(result).toEqual({
                        text: '<@abc> \'s :partydank: meme',
                        attachments: [
                            { title: '', image_url: MOCK_URL },
                        ],
                    });
                    expect(axios).toHaveBeenCalledWith({
                        url: 'https://api.imgflip.com/caption_image',
                        method: 'post',
                        params: {
                            template_id: '61527',
                            username: undefined,
                            password: undefined,
                            'boxes[0][text]': 'do',
                            'boxes[1][text]': 'memes',
                        },
                    });
                });
            });

            describe('when the imgflip call is not successful', () => {
                beforeAll(async () => {
                    axios.mockResolvedValue({ data: { success: false } });
                    result = await createMeme({ text: MOCK_BOKU_MENTION });
                });

                it('returns null', async () => {
                    expect(result).toEqual(createMeme.ERROR_MESSAGE);
                    expect(axios).toHaveBeenCalledWith({
                        url: 'https://api.imgflip.com/caption_image',
                        method: 'post',
                        params: {
                            template_id: '61527',
                            username: undefined,
                            password: undefined,
                            'boxes[0][text]': 'do',
                            'boxes[1][text]': 'memes',
                        },
                    });
                });
            });
        });
    });
});
