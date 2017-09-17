'use strict';

let apiai = require('apiai');
let crypto = require('crypto');
let fs = require('fs');

let app = apiai(process.env.API_AI_ACCESS_TOKEN, {
    language: 'en'
});

let results = {
    sessionId: '',
    analysis: {},
    message: ''
};

function handleText(text, callback) {
    let options = {
        sessionId: crypto.randomBytes(16).toString('hex')
    };
    let request = app.textRequest(text, options);

    request.on('response', function (res) {
        results.sessionId = res.sessionId;
        results.analysis = res.result.parameters;
        results.message = 'Success analyzed text.';

        callback(results);
    });

    request.on('error', function (err) {
        console.error('Error with API.AI handling text: ' + err);
        results.message = 'Error with API.AI handling text.';

        callback(results);
    });

    request.end();
}

function handleAudio(audio, callback) {
    let options = {
        sessionId: crypto.randomBytes(16).toString('hex')
    };
    let request = app.voiceRequest(options);

    request.on('response', function (res) {
        results.sessionId = res.sessionId;
        results.analysis = res.result.parameters;
        results.message = 'Successfully analyzed audio.';

        callback(results);
    });

    request.on('error', function (err) {
        console.error('Error with API.AI handling audio: ' + err);
        results.message = 'Error with API.AI handling audio.';

        callback(results);
    });

    fs.readFile(audio, function (err, buf) {
        if (err) {
            console.error('Error with reading audio file: ' + err);
        } else {
            request.write(buf);
        }

        request.end();
    });
}

module.exports.handleText = handleText;
module.exports.handleAudio = handleAudio;
