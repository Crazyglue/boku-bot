const axios = require('axios');
const memeTable = require('./memeTemplates.json');
const parseInputText = require('./parseInputText');

const { IMAGE_FLIP_USERNAME, IMAGE_FLIP_PASSWORD } = process.env;

module.exports = async function createMeme(text = '') {
    if (!text || text.length === 0) {
        return null;
    }

    const [templateName, ...textValues] = parseInputText(text);

    const template = memeTable.find((memeTemplate) => memeTemplate.name.toLowerCase() === templateName.toLowerCase());

    const textData = textValues.reduce((acc, snippet, index) => ({
        ...acc,
        [`text${index}`]: snippet,
    }), {});

    const response = await axios({
        url: 'https://api.imgflip.com/caption_image',
        method: 'post',
        params: {
            template_id: template.id,
            username: IMAGE_FLIP_USERNAME,
            password: IMAGE_FLIP_PASSWORD,
            ...textData,
        },
    });

    if (response.data.success) {
        return response.data.data.url;
    }
    return null;
};
