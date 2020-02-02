import generateMemeTemplatesResponse from './generateMemeTemplatesResponse';

describe('generateMemeTemplatesResponse', () => {
    it('creates a propertly formatted slack message', async () => {
        const result = await generateMemeTemplatesResponse({ user: 'HulkHogan' })
        expect(result).toEqual({
            text: '<@HulkHogan> here are some meme templates along with how many boxes they have.\nHeres an example for `Drake Hotline Bling (2)`\n`@boku !create \"Drake Hotline Bling\" \"Memorizing all the meme templates\" \"Letting boku tell you the templates\"`',
            attachments: [
                {
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: '`Drake Hotline Bling (2)` - `Woman Yelling At Cat (2)` - `Distracted Boyfriend (3)` - `Two Buttons (2)` - `Mocking Spongebob (2)` - `Change My Mind (2)` - `Left Exit 12 Off Ramp (3)` - `Expanding Brain (4)` - `Batman Slapping Robin (2)` - `Blank Nut Button (2)` - `Running Away Balloon (5)` - `Boardroom Meeting Suggestion (4)` - `Marked Safe From (2)` - `Surprised Pikachu (3)` - `Waiting Skeleton (2)` - `Roll Safe Think About It (2)` - `Spongebob Ight Imma Head Out (2)` - `Inhaling Seagull (4)` - `Tuxedo Winnie The Pooh (2)` - `X, X Everywhere (2)` - `Disaster Girl (2)` - `Is This A Pigeon (3)` - `One Does Not Simply (2)` - `Epic Handshake (3)` - `Ancient Aliens (2)` - `The Scroll Of Truth (2)` - `American Chopper Argument (5)` - `Trump Bill Signing (2)` - `Hide the Pain Harold (2)` - `Y\'all Got Any More Of That (2)` - `The Rock Driving (2)` - `Unsettled Tom (2)` - `Star Wars Yoda (2)` - `Who Killed Hannibal (3)` - `Futurama Fry (2)` - `Oprah You Get A (2)` - `Third World Skeptical Kid (2)` - `Finding Neverland (3)` - `The Most Interesting Man In The World (2)` - `Hard To Swallow Pills (2)` - `Evil Kermit (2)` - `Leonardo Dicaprio Cheers (2)` - `Dont You Squidward (2)` - `Grandma Finds The Internet (2)` - `Black Girl Wat (2)` - `First World Problems (2)` - `Third World Success Kid (2)` - `That Would Be Great (2)` - `Brace Yourselves X is Coming (2)` - `Me And The Boys (2)` - `Doge (5)` - `But Thats None Of My Business (2)` - `Who Would Win? (2)` - `Y U No (2)` - `Evil Toddler (2)` - `Laughing Men In Suits (2)` - `Face You Make Robert Downey Jr (2)` - `Bad Luck Brian (2)` - `Dr Evil Laser (2)` - `X All The Y (2)` - `Success Kid (2)` - `Jack Sparrow Being Chased (2)` - `This Is Where I\'d Put My Trophy If I Had One (2)` - `Well Yes, But Actually No (2)` - `Sleeping Shaq (2)` - `Presidential Alert (2)` - `Be Like Bill (4)` - `Squidward (2)` - `Scared Cat (2)` - `See Nobody Cares (2)` - `Imagination Spongebob (2)` - `Put It Somewhere Else Patrick (2)` - `Maury Lie Detector (2)` - `Uncle Sam (2)` - `Simba Shadowy Place (2)` - `Say it Again, Dexter (2)` - `Matrix Morpheus (2)` - `Creepy Condescending Wonka (2)` - `Grumpy Cat (2)` - `Too Damn High (2)` - `Surprised Koala (2)` - `Philosoraptor (2)` - `Mugatu So Hot Right Now (2)` - `Look At Me (2)` - `Good Fellas Hilarious (2)` - `Yo Dawg Heard You (2)` - `Mr Krabs Blur Meme (2)` - `Kevin Hart (2)` - `Picard Wtf (2)` - `And Just Like That (2)` - `Captain Picard Facepalm (2)` - `Pentagon Hexagon Octagon (2)` - `Star Wars No (2)` - `Bird Box (2)` - `Sparta Leonidas (2)` - `Marvel Civil War 1 (2)` - `Am I The Only One Around Here (2)` - `Arthur Fist (2)` - `Peter Parker Cry (4)` - `Ill Just Wait Here (2)`'
                            }
                        }
                    ]
                }
            ]
        })
    })
})