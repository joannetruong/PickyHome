'use strict';

let usersDatabase = require(__dirname + '/../lib/usersDatabase.js');
let readingsDatabase = require(__dirname + '/../lib/readingsDatabase.js');
let routes = require('express').Router();

// GET request to home page
routes.get('/', function (req, res) {
    res.status(200).sendFile('index.html', {root: './'});
});

routes.get('/index.html', function (req, res) {
    res.status(200).sendFile('index.html', {root: './'});
});

routes.get('/favicon.ico', function (req, res) {
    res.status(200).send();
});

routes.get('/public/monitor.html', function (req, res) {
    res.status(200).sendFile('monitor.html', {root: './public'});
});

routes.get('/public/control.html', function (req, res) {
    res.status(200).sendFile('control.html', {root: './public'});
});

routes.get('/public/style.css', function (req, res) {
    res.status(200).sendFile('style.css', {root: './public'});
});

routes.get('/public/index.js', function (req, res) {
    res.status(200).sendFile('index.js', {root: './public'});
});

routes.get('/public/img/lamp1.jpg', function (req, res) {
    res.status(200).sendFile('lamp1.jpg', {root: './public/img'});
});

routes.get('/public/img/light1.png', function (req, res) {
    res.status(200).sendFile('light1.png', {root: './public/img'});
});

routes.get('/public/img/power.jpeg', function (req, res) {
    res.status(200).sendFile('power.jpeg', {root: './public/img'});
});

routes.get('/public/img/power.png', function (req, res) {
    res.status(200).sendFile('power.png', {root: './public/img'});
});

routes.get('/public/img/temp.png', function (req, res) {
    res.status(200).sendFile('temp.png', {root: './public/img'});
});

routes.post('/command', function (req, res) {

});

routes.get('/readings', function (req, res) {
    console.log('GET request to /readings.');
    if (req.query) {
        let type = req.query.type;
        readingsDatabase.readData(type, function (data) {
            res.status(200).send(data);
        });
    } else {
        console.error('Request has no query string params.');
        res.status(400).send('ERROR! There\'s no query string params! What is you doing???');
    }
});

routes.post('/readings', function (req, res) {
    console.log('POST request to /readings.');
    if (req.body) {
        console.log(req.body);
        if (req.body.temp && req.body.energy) {
            let data = {
                temp: parseFloat(req.body.temp),
                energy: parseFloat(req.body.energy)
            };

            readingsDatabase.writeData(data, function () {
                res.status(200).send();
            });
        } else {
            res.status(400).send('Request has an invalid body.');
        }
    } else {
        console.error('Request has no body.');
        res.status(400).send('ERROR! There\'s no body in the request! What is you doing???');
    }
});

routes.post('/login', function (req, res) {
    console.log('LOGIN ATTEMPT.');

    if (req.body) {
        if (req.body.username && req.body.password) {
            let loginInfo = {
                username: req.body.username,
                password: req.body.password
            };

            usersDatabase.authenticate(loginInfo, function (authResults) {
                if (authResults.authorized) {
                    // @TODO login
                } else {
                    res.status(401).send(authResults.message);
                }
            });
        } else {
            res.status(400).send('Request has an invalid body.');
        }
    } else {
        console.error('Request has no body.');
        res.status(400).send('ERROR! There\'s no body in the request! What is you doing???');
    }
});

module.exports = routes;
