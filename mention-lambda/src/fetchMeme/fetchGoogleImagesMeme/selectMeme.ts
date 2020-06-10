import { Google } from '../../../../types/googleTypes';
import { FeedbackMap } from './fetchFeedback';
import logger from '../../logger';

function getRandom(sumOfWeights: number) {
    let random = Math.floor(Math.random() * (sumOfWeights + 1));

    return (weight: number) => {
        random -= weight;
        return random <= 0;
    };
}

interface Website {
    domain: string;
    weight: number;
}

export default function selectMeme(memes: Google.SearchResultItem[], memeFeedback: FeedbackMap): Google.SearchResultItem {
    const log = logger.child({ functionName: 'selectMeme', memes, memeFeedback })
    log.info('Selecting meme')
    const existingSites = memes.map(meme => meme.displayLink);
    const memeFeedbackArray: Website[] =  Object.entries(memeFeedback)
        .reduce((arr, [ domain, weight ]) => [...arr, { domain, weight }], [])
        .filter(website => existingSites.includes(website.domain));
    const sum =  memeFeedbackArray.reduce((total, { weight }) => total + weight, 0);
    const website =  memeFeedbackArray.find((website) => getRandom(sum)(website.weight));
    log.info('Found website', { website })

    if (!website) {
        log.info('Website is undefined, returning totally random meme')
        // selected a totally random meme
        return memes[Math.floor(Math.random() * memes.length)];
    }

    const domainMemes = memes.filter(meme => website.domain.includes(meme.displayLink))

    const selectedMeme = domainMemes[Math.floor(Math.random() * domainMemes.length)];

    log.info('Selected a meme', { selectedMeme });

    return selectedMeme;
}
