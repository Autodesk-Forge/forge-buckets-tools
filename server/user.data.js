'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const electron = require('electron');
const path = require('path');
const fs = require('fs');

const userDataFileName = 'buckets-tools.json';

router.get('/userdata', function (req, res) {
    let userDataPath = (electron.app || electron.remote.app).getPath('userData');
    try {
        userDataPath = path.join(userDataPath, userDataFileName);
        let json = JSON.parse(fs.readFileSync(userDataPath));
        res.json(json);
    } catch (ex) {
        res.status(404).end("No user data");
    }
})

router.post('/userdata', jsonParser, function (req, res) {
    try {
        let data = JSON.stringify(req.body);
        let userDataPath = (electron.app || electron.remote.app).getPath('userData');
        userDataPath = path.join(userDataPath, userDataFileName);
        fs.writeFileSync(userDataPath, data);
        res.end("Saved user data");
    } catch (ex) {
        res.status(500).end("Failed to save user data");
    }
})

/////////////////////////////////////////////////////////////////
// Return the router object that contains the endpoints
/////////////////////////////////////////////////////////////////
module.exports = router;