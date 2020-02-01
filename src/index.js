require('dotenv').config();

const slackVerification = require('./slackVerification');
const handleEvent = require('./handleEvent');

const eventToHandler = {
    url_verification: slackVerification,
    event_callback: handleEvent,
};

// Lambda handler
exports.handler = (data, context, callback) => {
    // console.log('TCL: exports.handler -> data', data);
    console.log('TCL: exports.handler -> data', data.body);
    const parsedData = JSON.parse(data.body);
    const handleFn = eventToHandler[parsedData.type];

    if (handleFn) {
        handleFn(parsedData, callback);
    } else {
        // return an error response
        callback(null);
    }
};
