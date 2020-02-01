const axios = require('axios');
const memeTable = require('./memeTemplates.json');
const parseInputText = require('./parseInputText');

const { IMAGE_FLIP_USERNAME, IMAGE_FLIP_PASSWORD } = process.env;

const ERROR_MESSAGE = { text: ':ohno: Something went wrong :ohno:' };

module.exports = async function createMeme({ text = '', user } = {}) {
    if (!text || text.length === 0) {
        return ERROR_MESSAGE;
    }

    const [templateName, ...textValues] = parseInputText(text);

    const template = memeTable.find((memeTemplate) => memeTemplate.name.toLowerCase() === templateName.toLowerCase());

    const boxes = textValues.reduce((acc, snippet, index) => ({
        ...acc,
        [`boxes[${index}][text]`]: snippet,
    }), {});

    // const boxes = textValues.map((boxText) => ({
    //     text: boxText,
    // }));

    console.log('TCL: boxes', boxes);

    const response = await axios({
        url: 'https://api.imgflip.com/caption_image',
        method: 'post',
        params: {
            template_id: template.id,
            username: IMAGE_FLIP_USERNAME,
            password: IMAGE_FLIP_PASSWORD,
            ...boxes,
        },
    });

    if (response.data.success) {
        const successText = `<@${user}> 's :partydank: meme`;
        const attachments = [
            { title: '', image_url: response.data.data.url },
        ];

        return {
            text: successText,
            attachments,
        };
    }
    return ERROR_MESSAGE;
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
