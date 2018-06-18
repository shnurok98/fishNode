const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const scores = require('./routes/scores');

const app = express();

// const q = require('./query');
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/', index);
app.use('/users', users);
app.use('/scores', scores);


app.listen(3000, () => {
	console.log('Сервер работает на 3000 порту');
});

