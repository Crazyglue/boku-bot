import axios from 'axios';
import { SlackAPI } from '../../types/slackTypes';
import { Reddit } from '../../types/redditTypes';

function fetchMemes(searchString: string) {
    const searchUrl = `https://www.reddit.com/r/dankmemes/search.json?q=${searchString}&sort=top`;

    return axios.request<Reddit.RedditReponse>({
        method: 'get',
        url: searchUrl
    }).then(res => res.data);
}
/* eslint-disable no-console */
const imageExtensionRegex = /\.(png|jpg|jpeg|gif)/;
const gifvExtensionRegex = /^[^.]+$|\.(?!(gifv))([^.]+$)/;

function images(post: Reddit.RedditPost) {
    return imageExtensionRegex.test(post.data.url) && gifvExtensionRegex.test(post.data.url);
}

export default async function fetchRedditMeme(event: SlackAPI.Event, authedUsers: string[] = []): Promise<SlackAPI.SlackPost> {
    const removedUsers = authedUsers.reduce((finalString, user) => finalString.replace(`<@${user}>`, ''), event.text);
    const sanitizedMessage = removedUsers.replace('meme', '').trim();

    const { data: { children: posts = [] } } = await fetchMemes(sanitizedMessage);

    const imagePosts = posts.filter(images);

    if (imagePosts.length === 0) {
        const text = `:ohno: Sorry <@${event.user}> couldn't find any memes :ohno:`;
        return { text };
    }

    const randomIndex = Math.floor(imagePosts.length * Math.random());
    const randomPost = imagePosts[randomIndex];
    const { title, url } = randomPost.data;

    const text = 'Heres a :partydank: meme';
    const attachments = [
        { title, image_url: url },
    ];

    return {
        text,
        attachments,
    };
};
