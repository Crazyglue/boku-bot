export function sum(numbers: number[]): number {
    return numbers.reduce((t, n) => t + n, 0);
}

export function standardDeviation(weights: number[]): number {
    const mean = sum(weights) / weights.length;

    const squared = weights.map(weight => Math.pow(weight - mean, 2));
    const stdDev = Math.sqrt(sum(squared) / squared.length);

    return stdDev;
}

export function logisticboi(x: number, averageScore: number, kValue: number = 1) {
    return 1 / (1 + Math.exp(-kValue * (x - averageScore)));
}