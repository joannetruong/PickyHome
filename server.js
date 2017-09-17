'use strict';

let routes = require(__dirname + '/routes/index.js');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');

let app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// @TODO session cookie stuff
// app.use(session({
//     secret: 'picky_home_secret_token',
//     genid: function (req) {
//         return genuuid();
//     },
//     cookie: {
//         'max-age': 60000
//     }
// }));

app.listen(app.get('port'), function () {
    console.log('Running on port ' + app.get('port') + '...');
});

app.use('/', routes);
