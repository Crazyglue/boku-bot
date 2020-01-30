const axios = require('axios');

function fetchMemes(searchString = '') {
    const searchUrl = `https://www.reddit.com/r/dankmemes/search.json?q=${searchString}&sort=top`;

    return axios.get(searchUrl);
}

module.exports = async function fetchRedditMeme(searchString = '') {
    const response = await fetchMemes(searchString);
    console.log('TCL: fetchRedditMeme -> data', response.data);
};
