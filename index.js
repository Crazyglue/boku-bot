require('dotenv').config();

const slackVerification = require('./src/slackVerification');
const handleEvent = require('./src/handleEvent');

const eventToHandler = {
    url_verification: slackVerification,
    event_callback: handleEvent,
};

// Lambda handler
exports.handler = (data, context, callback) => {
    const parsedData = JSON.parse(data.body);
    const handleFn = eventToHandler[parsedData.type];

    if (handleFn) {
        handleFn(parsedData, callback);
    } else {
        // return an error response
        callback(null);
    }
};
