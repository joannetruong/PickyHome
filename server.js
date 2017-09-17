'use strict';

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
