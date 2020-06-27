// jest.mock('../logger', () => ({ info: jest.fn(), child: jest.fn() }));
jest.mock('deepai', () => ({ callStandardApi: jest.fn(), setApiKey: jest.fn() }));

import createTextResponse from './index';
import deepai from 'deepai';

const MOCK_USER = `<@UT8HQLEF9>`
const MOCK_USER_TEXT = `${MOCK_USER} in a boxing match?`
const MOCK_LONG_RESPONSE = `\n\n\"Oh yeah, a fight of this magnitude. I have a fighter that was on the level, coming in under an hour, on an hour-long fight to defend his title. This kid is doing a perfect job.\"\n\nA.J. Dillashaw vs. Otero was a close contest. In the end, I was looking forward to the rematch.\n\n\"It was a close rematch for me,\" Dillashaw said. \"I just added another fight, I made a decision. If you don't see it coming, watch it. It was a close contest. It was one in a very close contest. They have a big division on the rise, so they can be great in it for the future.\"<|endoftext|>\"You see how easy it is to forget about the internet.\"\n\n– Dave Robson\n\nThe good news is that, if you are going to be a politician, the internet, is just as much as your business or politics.\n\nYes, there are countless ways such as being an elected cop, or fighting over a bad grammatical mistake, or being a lawyer, or even a prosecutor, in a legal case.\n\nMost of these methods are pretty standard, but the best is that often these tricks often are implemented against anyone who can convince themselves or the media to bend.\n\nThat's the lesson of it all, too.\n\nAnd it's probably the only way to learn in any other way possible.\n\n1) Do The \"No\" Job\n\nDon't think in the abstract about giving someone a job or training, do the \"No\" Job. Even if someone is a police officer, you have to prove that they are a criminal, then you will not be able to get to a full stop.\n\nYou need to take a three-minute walk (the distance from an actual stop sign) down Route 116 to the nearest store and do the \"No\" Job. That's how all the \"No\" Job works. You need to know everything about an activity and know a reason for it.\n\nThen you'll learn most of what you just did to start doing it.\n\nThen you'll learn the details about how to get to this job, how to pay your dues for a job for a \"No.\"\n\nNow that you know how to pay the bills and get the job done, you can learn all about how to do it, what to do, and even how to prepare the best for yourself.\n\n2) Get to Be Practical\n\nThe job of a politician is not only to keep your kids in school, but also to try to make the most of them.\n\nThat's one thing to do.\n\nIt is easy to start a business or the public life, or even become something new.\n\nSo here's the hard part.\n\nMost of us start small and get by just by.\n\nThen you're lucky.\n\nIt's the only kind of information that exists online and to do it for fun is to find a job for yourself. That's how you should be doing it.\n\nTo make the easiest possible for you to start small, you should make certain people know what you are doing and they don't give it to the media.\n\nYou should work closely with the editors at the Daily Mail, as the editors do.\n\nYou should be very familiar with the layout of many magazines and not be in a hurry to start a business.\n\nYou should always choose a good layout and work like a boss.\n\nYour first job should be to make sure everything has been presented correctly, the way you should be working is best done in a realistic and easy way.\n\nThe best way to start a business is to go down a list.\n\nOn those first 10 of your papers, then the first 10 in your history, you will have to keep track of the changes and the changes, then work your best until the last 10 of your papers is perfect.\n\nThen you will be ready for the last five papers, so you need to make up five new ones, and then a new 3-6, which have now been published in your first 6 papers.\n\nYou are also at the point you should create a little story that you want to tell that is the only one that can really tell the story that you really wish to tell. If you wish to tell that story, you need to go to the end or start a new industry.\n\nA huge part of the best of the best stuff is not only that you have to do it, but that you should go and do it for what it is. I think it's a great way to create an industry in a way that is also a story that everyone wants to hear, and that you have to tell the same story.\n\nIt's an important thing to remember and to focus on what really makes people.\n\nHow I did what it`;
const MOCK_SHORT_RESPONSE = `\n\n\"Oh yeah, a fight of this magnitude`;

describe('createTextResponse', () => {
    describe('when a short response text is returned', () => {
        it('returns the whole response', async () => {
            // deepai.callStandardApi = jest.fn();
            (deepai.callStandardApi as jest.Mock).mockResolvedValue({
                output: MOCK_SHORT_RESPONSE,
                id: 'abc'
            });
            const result = await createTextResponse(MOCK_USER_TEXT)
            expect(result).toEqual(MOCK_SHORT_RESPONSE.trim());
        })
    })

    describe('when a long response is returned', () => {
        it('returns a trimmed response', async () => {
            // deepai.callStandardApi = jest.fn();
            (deepai.callStandardApi as jest.Mock).mockResolvedValue({
                output: MOCK_LONG_RESPONSE,
                id: 'abc'
            });
            const result = await createTextResponse(MOCK_USER_TEXT)
            expect(result).toEqual("\"Oh yeah, a fight of this magnitude I have a fighter that was on the level, coming in under an hour, on an hour-long fight to defend his title This kid is doing a perfect job");
        })
    })
})