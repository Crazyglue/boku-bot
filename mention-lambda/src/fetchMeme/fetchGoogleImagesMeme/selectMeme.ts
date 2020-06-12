import { Google } from '../../../../types/googleTypes';
import { WebsiteFeedback } from './fetchFeedback';
import logger from '../../logger';
import { sum, standardDeviation, logisticboi } from './math';

interface ProbableWebsite {
    domain: string;
    score: number;
    probability: number;
}

interface SelectedMemeDto {
    selectedMeme: Google.SearchResultItem;
    probability: number;
}

function mapValue<T, K extends keyof T>(arr: T[], key: K) {
    return arr.map(v => v[key]);
}

function getRandom(weights: WebsiteFeedback[]): ProbableWebsite {
    const log = logger.child({ functionName: 'getRandom' })

    const scores = mapValue(weights, 'score');
    const sumScore = sum(scores);
    const averageScore = sumScore / weights.length;
    const stdDev = standardDeviation(scores)

    log.info('Computed probability factors', { averageScore, sumScore, stdDev });

    const probabilities: ProbableWebsite[] = weights.map((weight) => ({
        ...weight,
        probability: logisticboi(weight.averageImageScore, averageScore, 1 / stdDev)
    })).sort((a, b) => b.probability - a.probability); // descending

    const sumProbabilities = sum(mapValue(probabilities, 'probability'));

    let runningTotal = 0;
    const probSums = probabilities.map(({ probability }) => (runningTotal += probability));
    const random = Math.random() * sumProbabilities;
    const index = probSums.filter(sum => sum <= random).length
    const selectedWebsite = probabilities[index];

    log.info('Found the probabilties of each website', { probabilities, selectedWebsite, sum, random, index, probSums })

    return {
        ...selectedWebsite,
        probability: selectedWebsite.probability / sumProbabilities
    };
}

export default function selectMeme(memes: Google.SearchResultItem[], memeFeedback: WebsiteFeedback[]): SelectedMemeDto {
    const log = logger.child({ functionName: 'selectMeme', memes, memeFeedback })
    log.info('Selecting meme')

    // Pluck all the websites out of the search results
    const existingSites = mapValue(memes, 'displayLink');

    // Filter out websites that are not in the search results
    const memeFeedbackArray = memeFeedback
        .filter(website => existingSites.includes(website.domain.replace(/^https?\:\/\//, '')));

    // Find a weighted-random website
    const website = getRandom(memeFeedbackArray);

    log.info('Found website', { website })

    if (!website) {
        log.info('Website is undefined, returning totally random meme')
        // selected a totally random meme
        return {
            selectedMeme: memes[Math.floor(Math.random() * memes.length)],
            probability: 1 / memes.length
        };
    }

    // Filter out the memes that are not in the selected website
    const domainMemes = memes.filter(meme => website.domain.includes(meme.displayLink))

    // Pluck a _random_ meme out of the memes from that website
    const index = Math.floor(Math.random() * domainMemes.length);
    const selectedMeme = domainMemes[index];

    log.info('Selected a meme', { selectedMeme, website });

    return {
        selectedMeme,
        probability: website.probability
    };
}
