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
            console.error('Error with reading data from \'users\': ' + err);
        }

        mongoose.disconnect();

        let auth = {
            authorized: false,
            message: ''
        };
        
        if (docs === null || docs.length === 0) {
            auth.message = 'Could not find user \'' + loginInfo.username + '\'.';
            callback(auth);
        } else {
            if (docs[0].password && loginInfo.password === docs[0].password) {
                auth.authorized = true;
                auth.message = 'Authorized user \'' + loginInfo.username + '\'.';
                callback(auth);
            } else {
                console.error('Error with authentication.');
                auth.message = 'Error with authentication.';
                callback(auth);
            }
        }
    });
}

module.exports.authenticate = authenticate;
