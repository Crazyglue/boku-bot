import { sum, standardDeviation, logisticboi } from './math';

describe('math', () => {
    describe('sum', () => {
        it('adds all the numbers together in an array', () => {
            const arr = [1, 2, 3, 4];
            expect(sum(arr)).toEqual(10);
        })
    })

    describe('standardDeviation', () => {
        it('gets the standard deviation from an array of numbers', () => {
            const arr = [ 9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4 ]
            expect(standardDeviation(arr)).toEqual(2.9832867780352594)
        })
    })

    describe('logisticboi', () => {
        it('returns a normalized value', () => {
            expect(logisticboi(12, 3, .5)).toEqual(0.9890130573694068)
            expect(logisticboi(13, 1)).toEqual(0.9999938558253978)
            expect(logisticboi(-5, 12, .25)).toEqual(0.014063627043245475)
        })
    })
})