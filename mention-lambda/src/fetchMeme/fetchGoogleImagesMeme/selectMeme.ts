import { Google } from '../../../../types/googleTypes';
import { FeedbackMap } from './fetchFeedback';
import logger from '../../logger';

function logisticboi(x: number, averageScore: number, sumOfScores?: number) {
    const kValue = sumOfScores ? 1 / sumOfScores : 1; // scaling factor
    return 1 / (1 + Math.exp(-kValue * (x - averageScore)));
}

function getRandom(weights: Website[]): ProbableWebsite {
    const log = logger.child({ functionName: 'getRandom' })

    const sumScore = weights.reduce((total, { weight }) => total + weight, 0)
    const averageScore = sumScore / weights.length;

    log.info('Computed probability factors', { averageScore, sumScore });

    const probabilities = weights.map(({ domain, weight }) => ({
        domain,
        weight,
        probability: logisticboi(weight, averageScore, sumScore)
    })).sort((a, b) => b.probability - a.probability); // descending

    const sum = probabilities.reduce((total, website) => total + website.probability, 0);

    let runningTotal = 0;
    const probSums = probabilities.map(({ probability }) => (runningTotal += probability));
    const random = Math.random() * sum;
    const index = probSums.filter(sum => sum <= random).length
    const selectedWebsite = probabilities[index];

    log.info('Found the probabilties of each website', { probabilities, selectedWebsite, sum, random, index, probSums })

    return {
        ...selectedWebsite,
        probability: selectedWebsite.probability / sum
    };
}

interface Website {
    domain: string;
    weight: number;
}

interface ProbableWebsite extends Website {
    probability: number;
}

interface SelectedMemeDto {
    selectedMeme: Google.SearchResultItem;
    probability: number;
}

export default function selectMeme(memes: Google.SearchResultItem[], memeFeedback: FeedbackMap): SelectedMemeDto {
    const log = logger.child({ functionName: 'selectMeme', memes, memeFeedback })
    log.info('Selecting meme')
    const existingSites = memes.map(meme => meme.displayLink);

    const memeFeedbackArray: Website[] =  Object.entries(memeFeedback)
        .reduce((arr, [ domain, weight ]) => [...arr, { domain, weight }], [])
        .filter(website => existingSites.includes(website.domain.replace(/^https?\:\/\//, '')));
    const website = getRandom(memeFeedbackArray);
    const sum = memeFeedbackArray.reduce((total, { weight }) => total + weight, 0);
    log.info('Found website', { website })

    if (!website) {
        log.info('Website is undefined, returning totally random meme')
        // selected a totally random meme
        return {
            selectedMeme: memes[Math.floor(Math.random() * memes.length)],
            probability: 1 / memes.length
        };
    }

    const domainMemes = memes.filter(meme => website.domain.includes(meme.displayLink))

    const selectedMeme = domainMemes[Math.floor(Math.random() * domainMemes.length)];

    log.info('Selected a meme', { selectedMeme, website });

    return {
        selectedMeme,
        probability: website.probability
    };
}
