const axios = require('axios');
const memeTable = require('./memeTemplates.json');

const { IMAGE_FLIP_USERNAME, IMAGE_FLIP_PASSWORD } = process.env;

const createMemeRegex = /^.+(!create).+"(.+)"\s"(.+)"\s"(.+)?"/g;

module.exports = async function createMeme(text = '') {
    if (text.length === 0) {
        return null;
    }

    console.log('TCL: createMeme -> text', text);
    const [, , templateName, text0, text1] = createMemeRegex.exec(text);
    console.log('TCL: createMeme -> templateName, text0, text1', templateName, text0, text1);

    const template = memeTable.find((memeTemplate) => memeTemplate.name.toLowerCase() === templateName.toLowerCase());
    console.log('TCL: createMeme -> template', template);

    console.log('params', {
        template_id: template.id,
        username: IMAGE_FLIP_USERNAME,
        password: IMAGE_FLIP_PASSWORD,
        text0,
        text1,
    });

    const response = await axios({
        url: 'https://api.imgflip.com/caption_image',
        method: 'post',
        params: {
            template_id: template.id,
            username: IMAGE_FLIP_USERNAME,
            password: IMAGE_FLIP_PASSWORD,
            text0,
            text1,
        },
    });

    console.log('TCL: createMeme -> response', response);
    if (response.data.success) {
        console.log('TCL: createMeme -> response.data.data', response.data.data);
        return response.data.data.url;
    }
    return null;
};
