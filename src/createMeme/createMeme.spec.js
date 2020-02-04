jest.mock('axios');

import axios from 'axios';
import createMeme, { ERROR_MESSAGE } from './index';

const MOCK_BOKU_MENTION = '<@boku> !create "y u no" "do" "memes"';

describe('createMeme', () => {
    describe('when input text is blank, not provided, or null', () => {
        it('returns null', async () => {
            expect(await createMeme({ text: null })).toEqual(ERROR_MESSAGE);
            expect(await createMeme({})).toEqual(ERROR_MESSAGE);
            expect(await createMeme({ text: '' })).toEqual(ERROR_MESSAGE);
        });
    });

    describe('when input text is valid', () => {
        let result;

        describe('when the requested template is in the list', () => {
            const MOCK_URL = 'http://foo.io';

            describe('when the imgflip call is successful', () => {
                beforeAll(async () => {
                    axios.request = jest.fn().mockResolvedValue({ data: { success: true, data: { url: MOCK_URL } } });
                    result = await createMeme({ text: MOCK_BOKU_MENTION });
                });

                it('returns the meme url', async () => {
                    expect(result).toEqual({
                        text: 'Heres your :partydank: meme',
                        attachments: [
                            { title: '', image_url: MOCK_URL },
                        ],
                    });
                    expect(axios.request).toHaveBeenCalledWith({
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
                    axios.request = jest.fn().mockResolvedValue({ data: { success: false } });
                    result = await createMeme({ text: MOCK_BOKU_MENTION });
                });

                it('returns null', async () => {
                    expect(result).toEqual(ERROR_MESSAGE);
                    expect(axios.request).toHaveBeenCalledWith({
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
