const moment = require('moment');

//Wraps a text message in an object containing username, message and time
function wrapMessage(username, message) {
    return {
        username,
        message,
        time: moment().format('h:mm a')
    };
}

module.exports = wrapMessage;