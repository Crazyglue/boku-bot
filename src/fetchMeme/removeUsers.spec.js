import removeUsers from './removeUsers';

describe('removeUsers', () => {
    it('returns the same text when there are no users', () => {
        const text = 'there is no text here'
        const result = removeUsers(text);
        expect(result).toEqual(text);
    })

    it('returns the trimmed down text with multiple users all over the text', () => {
        const text = '<@user> there is a person <@here> who thinks they can get the attention of <@other>';
        const result = removeUsers(text);
        expect(result).toEqual('there is a person  who thinks they can get the attention of')
    })
})
