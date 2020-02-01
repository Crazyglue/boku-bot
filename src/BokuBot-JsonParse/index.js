exports.handler = function jsonParse(data, context, callback) {
    const parsedData = JSON.parse(data.body);

    callback(null, parsedData);
};
