import parseInputText from './parseInputText';

const MOCK_MENTIONS = [
    ['<@boku> !create "Too Damn High" "thefoss" "com/"', ['Too Damn High', 'thefoss', 'com/']],
    ['<@boku> !create "Grumpy Cat" "ah.  i" "mean, there is"', ['Grumpy Cat', 'ah.  i', 'mean, there is']],
    ['<@boku> !create "Be Like Bill" "for my liking  ``` My" "grandmother is so proud"', ['Be Like Bill', 'for my liking  ``` My', 'grandmother is so proud']],
    ['<@boku> !create "y u no" "do" "memes"', ['y u no', 'do', 'memes']],
    ['<@boku> !create "y u no" "do"', ['y u no', 'do']],
    ['@boku !create “Arthur Fist” “I hate” “d-gens from upcountry”', ['Arthur Fist', 'I hate', 'd-gens from upcountry']],
    ['@boku !create “American Chopper Argument” “Asset IO is not an acronym” “IO = input/output” “yeah so it makes sense” “SO IT IS AN ACRONYM” “NOT AN ACRONYM”', ['American Chopper Argument', 'Asset IO is not an acronym', 'IO = input/output', 'yeah so it makes sense', 'SO IT IS AN ACRONYM', 'NOT AN ACRONYM']],
    ['<@boku> !create "y u no" "do" "memes" "asdf", "DSAF"', ['y u no', 'do', 'memes', 'asdf', 'DSAF']],
    ['<@boku> !create "Imagination Spongebob" "very important to me  i" "remember reading a lot about"', ['Imagination Spongebob', 'very important to me  i', 'remember reading a lot about']],
    ['@boku !create "Spongebob Ight Imma Head Out" "< https" "//www r-project"', ['Spongebob Ight Imma Head Out', '< https', '//www r-project']],
];

describe('parseInputText', () => {
    MOCK_MENTIONS.forEach(([mention, outcome]) => {
        it(mention, () => {
            const result = parseInputText(mention);
            expect(result).toEqual(outcome);
        });
    });
});
