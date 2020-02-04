jest.mock('axios');

const axios = require('axios');
import sendSlackMessage from './index'

describe('sendSlackMessage', () => {
    describe('when no channel provided', () => {
        beforeAll(() => {
            axios.mockResolvedValue({});

        });

        it('doesnt call axios, and returns', async () => {
            await sendSlackMessage({ text: 'boomer' })
            expect(axios).not.toHaveBeenCalled();
        })
    })

    describe('when channel is provided', () => {
        beforeAll(() => {
            axios.mockResolvedValue({});

        });

        it('sends a slack message', async () => {
            await sendSlackMessage({ text: 'boomer' }, 'dankmemes')
            expect(axios).toHaveBeenCalledWith({
                headers: {
                    Authorization: expect.stringContaining('Bearer '),
                    'Content-Type': 'application/json'
                },
                method: 'post',
                url: 'https://slack.com/api/chat.postMessage',
                data: JSON.stringify({
                    channel: 'dankmemes',
                    text: 'boomer'
                })
            });
        })
    })
});
