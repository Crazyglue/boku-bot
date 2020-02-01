const quoteRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;

const replaceMacQuotes = (text: string) => text.replace(/“|”/g, '"');

export default function parseInputText(text: string = ''): string[] {
    return replaceMacQuotes(text).match(quoteRegex).map((t) => t.replace(/"/g, ''));
};
