'use strict';

let mongoose = require('mongoose');

let connectionStr = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@ds139844.mlab.com:39844/' + process.env.DB_NAME;

let usersSchema = new mongoose.Schema({
    username: String,
    password: String
});
let Users = mongoose.model('users', usersSchema);

function authenticate(loginInfo, callback) {
    mongoose.connect(connectionStr, {
        useMongoClient: true
    });

    let conditions = {
        username: loginInfo.username
    };

    Users.find(conditions, function (err, docs) {
        if (err) {
            console.error('Error with reading data from \'readings\'');
        }

        mongoose.disconnect();

        if (docs === null || docs.length === 0) {
            callback('Could not find user \'' + loginInfo.username + '\'.');
        } else {
            if ()
        }
    });
}