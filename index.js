require('dotenv').config();

const slackVerification = require('./src/slackVerification');
const handleEvent = require('./src/handleEvent');

const eventToHandler = {
    url_verification: slackVerification,
    event_callback: handleEvent,
};
/* eslint-disable no-console */
// Lambda handler
exports.handler = (data, context, callback) => {
    console.log('processing request');
    console.log(data);
    const parsedData = JSON.parse(data.body);
    const handleFn = eventToHandler[parsedData.type];

    console.log('boku 0.2 activated!');

    if (handleFn) {
        handleFn(parsedData, callback);
    } else {
        // return an error response
        callback(null);
    }
};
