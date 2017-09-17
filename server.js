'use strict';

//let command = require(__dirname + '/lib/command.js');
let database = require(__dirname + '/lib/database.js');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(app.get('port'), function () {
    console.log('Running on port ' + app.get('port') + '...');
});

// GET request to home page
app.get('/', function (req, res) {
    res.status(200).send('Hello World!');
});

app.get('/favicon.ico', function (req, res) {
    res.sendStatus(200);
});

app.post('/command', function (req, res) {

});

app.get('/readings', function (req, res) {
    console.log('GET request to /readings.');
    if (req.query) {
        let type = req.query.type;
        database.readData(type, function (data) {
            res.send(data);
        });
    } else {
        console.error('Request has no query string params.');
        res.sendStatus(400).send('ERROR! There\'s no query string params! What is you doing???');
    }
});

app.post('/readings', function (req, res) {
    console.log('POST request to /readings.');
    if (req.body) {
        console.log(req.body);
        if (req.body.temp && req.body.energy) {
            let data = {
                temp: parseFloat(req.body.temp),
                energy: parseFloat(req.body.energy)
            };

            database.writeData(data, function () {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(400).send('You fucked up.');
        }
    } else {
        console.error('Request has no body.');
        res.sendStatus(400).send('ERROR! There\'s no body in the request! What is you doing???');
    }
});
