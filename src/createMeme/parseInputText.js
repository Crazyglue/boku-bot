const quoteRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;

const replaceMacQuotes = (text) => text.replace(/“|”/g, '"');

module.exports = function parseInputText(text = '') {
    return replaceMacQuotes(text).match(quoteRegex).map((t) => t.replace(/"/g, ''));
};
