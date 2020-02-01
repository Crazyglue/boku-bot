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

// function formatPostsIntoMessage(post) {
//     return `${post.data.title}\n${post.data.url}`;
// }

module.exports = async function fetchRedditMeme(event, authedUsers) {
    const removedUsers = authedUsers.reduce((finalString, user) => finalString.replace(`<@${user}>`, ''), event.text);
    const sanitizedMessage = removedUsers.replace('meme', '').trim();

    const { data: { data: { children: posts = [] } } } = await fetchMemes(sanitizedMessage);

    const imagePosts = posts.filter(images);

    const randomIndex = Math.floor(imagePosts.length * Math.random());
    const randomPost = imagePosts[randomIndex];
    const postTitle = randomPost ? randomPost.data.title : '';
    const postUrl = randomPost ? randomPost.data.url : '';

    if (!postTitle || !postUrl) {
        const text = `:ohno: Sorry <@${event.user}> couldn't find any memes :ohno:`;
        return { text };
    }
    const text = 'Heres a :partydank: meme';
    const attachments = [
        { title: postTitle, image_url: postUrl },
    ];

    return {
        text,
        attachments,
    };
};
