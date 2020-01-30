const axios = require('axios');

function fetchMemes(searchString = '') {
    const searchUrl = `https://www.reddit.com/r/dankmemes/search.json?q=${searchString}&sort=top`;

    return axios.get(searchUrl);
}
/* eslint-disable no-console */
const imageExtensionRegex = /\.(png|jpg|jpeg|gif)/;

function images(post) {
    return imageExtensionRegex.test(post.data.url);
}

function formatPostsIntoMessage(post) {
    return `${post.data.title}

    ${post.data.url}`;
}

module.exports = async function fetchRedditMeme(searchString = '') {
    const { data: { data: { children: posts = [] } } } = await fetchMemes(searchString);

    const imagePosts = posts.filter(images).map(formatPostsIntoMessage);

    const randomIndex = Math.floor(imagePosts.length * Math.random());
    const randomImage = imagePosts[randomIndex];
    console.log('TCL: fetchRedditMeme -> randomImage', randomImage);
    return randomImage;
};
