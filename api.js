console.log('\n\n\n---STARTING SERVER\n\n\n'); //clear console everytime restarts

var express = require('express');

var bodyParser = require('body-parser');

var validator = require('validator');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies






app.listen(5050);