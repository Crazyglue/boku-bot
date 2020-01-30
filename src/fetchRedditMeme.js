const axios = require('axios');

function fetchMemes(searchString = '') {
    const searchUrl = `https://www.reddit.com/r/dankmemes/search.json?q=${searchString}&sort=top`;

    return axios.get(searchUrl);
}

const imageExtensionRegex = /\.(png|jpg|jpeg|gif)/;

function filterNonImages({ data: { children = [] } }) {
    console.log('TCL: filterNonImages -> children', children);
    return children
        .filter((post) => imageExtensionRegex.test(post.data.url))
        .map((post) => `${post.data.title}

        ${post.data.url}`);
}

module.exports = async function fetchRedditMeme(searchString = '') {
    console.log('TCL: fetchRedditMeme -> searchString', searchString);
    const response = await fetchMemes(searchString);
    console.log('TCL: fetchRedditMeme -> response', response.data);

    const imagePosts = filterNonImages(response.data);
    console.log('TCL: fetchRedditMeme -> imagePosts', imagePosts);
    const randomIndex = Math.floor(imagePosts.length * Math.random());
    const randomImage = imagePosts[randomIndex];
    const postTitle =
    return randomImage;
};
