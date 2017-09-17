'use strict';

let mongoose = require('mongoose');
let moment = require('moment');

let DatabaseName = 'picky-home';
let connectionStr = 'mongodb://localhost/' + DatabaseName;

let readingsSchema = new mongoose.Schema({
    time: String,
    temp: Number,
    energy: Number
});
let Readings = mongoose.model('readings', readingsSchema);

// Gets an array of the data.
function readData(type, callback) {
    mongoose.connect(connectionStr, {
        useMongoClient: true
    });

    let conditions = {
    };

    Readings.find(conditions, function (err, docs) {
        if (err) {
            throw new Error('Error with reading data.');
        }

        mongoose.disconnect();
        callback(formatReturnData(type, docs));
    });
}

// Writes a new reading to the database.
function writeData(data, callback) {
    mongoose.connect(connectionStr, {
        useMongoClient: true
    });

    let reading = new Readings({
        time: moment().format(),
        temp: data.temp,
        energy: data.energy
    });

    reading.save(function (err) {
        if (err) {
            console.error('Error with writing data.');
        }

        mongoose.disconnect();
        callback(null);
    });
}

// Formats the data to return.
function formatReturnData(type, data) {
    let formattedData = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i][type]) {
            formattedData.push([data[i].time, data[i][type]]);
        }
    }

    return formattedData;
}

module.exports.readData = readData;
module.exports.writeData = writeData;
