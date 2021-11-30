const { Router } = require('express');
const { Validator } = require('jsonschema');
const AWS = require('aws-sdk');
const md5 = require('md5');
const request = require('request');
const { isUri } = require('valid-url');
const path = require('path');
const AppState = require('./app-state-schema');


const router = new Router();

router.post('/save', ({ jsonBody, rawBody }, res) => {
    res.status(200);
});

router.post('/proxy', (req, res) => {
    res.status(200);
});


module.exports = router;
