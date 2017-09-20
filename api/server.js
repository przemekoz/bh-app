'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');
var streamError = fs.createWriteStream('error.log');
var validate = require('bh-validators');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set 
//it up, or 3001
var port = process.env.API_PORT || 3001;

mongoose.connect('mongodb://localhost:27017/bhdb', {
    useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var dbOpen = false;
db.once('open', function () {
    // we are connected!
    dbOpen = true;
});

var eventSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    date: { type: Date, default: Date.now }
});

//now we should configure the API to use bodyParser and look for 
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//now we can set the route path & initialize the API
router.get('/', function (req, res) {
    res.json({ message: 'API Initialized!' });
});

router.get('/test', function (req, res) {
    res.json({ message: 'ok!' });
});

router.get('/dbtest', function (req, res) {
    if (dbOpen) {
        res.json({ message: 'ok!' });
    }
    else {
        res.json({ message: 'fail!' });
    }
});


router.post('/saveEvent', function (req, res) {

    if (validRequest(req.body)) {
        var Event = mongoose.model('Event', eventSchema);
        var event = new Event({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            date: req.body.date
        });

        event.save(function (err, event) {
            if (err) {
                logError('can\'t save Event to DB');
                logError(err);
                res.json({ message: 'fail!', err: err });
            }
            else {
                res.json({ message: 'ok!' });
            }
        });
    }
    else {
        logError('can\'t save Event because some of validation errors');
        res.json({ message: 'fail!', err: 'validation fail' });
    }
});


//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function () {
    console.log(`api running on port ${port}`);
});


/// -----------------------------------------------

function logError(message) {
    streamError.once('open', function (fd) {
        streamError.write(new Date());
        streamError.write(message);
        streamError.end();
    });
}

function validRequest(body) {
    if (body.firstName &&
        body.lastName &&
        validate.email(body.email) &&
        validate.date(body.date)) {
        return true;
    }
    else {
        return false;
    }
}