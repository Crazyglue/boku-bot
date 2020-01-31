const quoteRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;

module.exports = function parseInputText(text) {
    return text.match(quoteRegex).map((t) => t.replace(/"/g, ''));
};
