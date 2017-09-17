'use strict';

let routes = require(__dirname + '/routes/index.js');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(app.get('port'), function () {
    console.log('Running on port ' + app.get('port') + '...');
});

app.use('/', routes);
