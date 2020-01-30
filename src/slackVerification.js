const constants = require('./constants');

const { SLACK_VERIFICATION_TOKEN } = process.env;

// Verify Url - https://api.slack.com/events/url_verification
module.exports = function verify(data, callback) {
    if (data.token === SLACK_VERIFICATION_TOKEN) {
        const body = JSON.stringify({ challenge: data.challenge });
        callback(null, {
            ...constants.DEFAULT_200_RESPONSE,
            body,
        });
    } else callback('verification failed');
};
