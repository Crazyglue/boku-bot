import selectMeme from './selectMeme';

const mock_memes = [
    {
        "kind": "customsearch#result",
        "title": "Mister Sandman Bring me a meme Make it the dumbest Shit i've ever ...",
        "htmlTitle": "Mister Sandman <b>Bring me a meme Make</b> it <b>the</b> dumbest Shit i&#39;ve ever ...",
        "link": "https://i.pinimg.com/originals/47/16/a8/4716a8d045c9f2ab6d97044226de852a.jpg",
        "displayLink": "www.pinterest.com",
        "snippet": "Mister Sandman Bring me a meme Make it the dumbest Shit i've ever ...",
        "htmlSnippet": "Mister Sandman <b>Bring me a meme Make</b> it <b>the</b> dumbest Shit i&#39;ve ever ...",
        "mime": "image/jpeg",
        "fileFormat": "image/jpeg",
        "image": {
            "contextLink": "https://www.pinterest.com/pin/657666351817601666/",
            "height": 553,
            "width": 750,
            "byteSize": 33325,
            "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7_66oSZqvWXGJudTaRZkI37SZ9qMSBfDBCAiMiH6MY7yv0LjIdKjs56A&s",
            "thumbnailHeight": 104,
            "thumbnailWidth": 141
        }
    },
    {
        "kind": "customsearch#result",
        "title": "The stars of reddit aligned to give me a meme. : PewdiepieSubmissions",
        "htmlTitle": "<b>The</b> stars of reddit aligned to <b>give me a meme</b>. : PewdiepieSubmissions",
        "link": "https://i.redd.it/kes89w64ydc11.jpg",
        "displayLink": "www.reddit.com",
        "snippet": "The stars of reddit aligned to give me a meme. : PewdiepieSubmissions",
        "htmlSnippet": "<b>The</b> stars of reddit aligned to <b>give me a meme</b>. : PewdiepieSubmissions",
        "mime": "image/jpeg",
        "fileFormat": "image/jpeg",
        "image": {
            "contextLink": "https://www.reddit.com/r/PewdiepieSubmissions/comments/927tc3/the_stars_of_reddit_aligned_to_give_me_a_meme/",
            "height": 1170,
            "width": 750,
            "byteSize": 73757,
            "thumbnailLink": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvnOeDwadXTxUY-r_vHVVsuJ9FvnJxLY3LciIqrdT-8OdoKieHVV-lbwQ&s",
            "thumbnailHeight": 150,
            "thumbnailWidth": 96
        }
    },
];

const mock_feedback =  [
    { domain: "http://www.reddit.com", score: 10, imgCount: 3, averageImageScore: 3 },
    { domain: "http://www.pinterest.com", score: 4, imgCount: 1, averageImageScore: 4 },
];


describe('selectMeme', () => {
    it('doesnt throw', () => {
        expect(() => selectMeme(mock_memes, mock_feedback)).not.toThrow();
    })
})