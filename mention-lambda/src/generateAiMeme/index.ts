import { fetchAiText } from '../api/deepai';
import memeTemplates from '../createMeme/memeTemplates.json';
import { ImageFlip } from '../../../types/imageFlipTypes';

const TOP_TEXT_WORD_COUNT = 5;
const OTHER_TEXT_WORD_COUNT = 10;

function getRandomIndex(length: number = 0) {
    return Math.floor(Math.random() * length);
}

export async function generateAiMeme(fullText: string) {
    const aiText = await fetchAiText(fullText);

    const randomTemplate: ImageFlip.ImageFlipMemeTemplate = memeTemplates[getRandomIndex(memeTemplates.length)];

    const topTextCandidates = aiText.split('.').filter(t => t.split(' ').length <= TOP_TEXT_WORD_COUNT);
    const otherTextCandidates = aiText.split('.').filter(t => t.split(' ').length <= OTHER_TEXT_WORD_COUNT);


    const topText = topTextCandidates[getRandomIndex(topTextCandidates.length)]
    const otherText = [];
    while (otherText.length <= randomTemplate.box_count - 1 && otherTextCandidates.length > 0) {
        const text = otherTextCandidates.splice(getRandomIndex(otherTextCandidates.length), 1);
        otherText.push(text);
    }

}