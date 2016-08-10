const express = require('express');
const bunyan = require('bunyan');
const reqLog = require('bunyan-request');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const log = require('./logger').getLogger(); 
const config = require('../env');

module.exports = function(db) {
    // Express Setup
    var app = express();

    // logging setup
    var reqLogger = reqLog({
        logger: log, 
		headerName: 'x-request-id', 
		serializers : {
    	    req: bunyan.stdSerializers.req,
	   	    res: bunyan.stdSerializers.res
		}
	});
    app.use(reqLogger);

    // Security
    app.use(helmet());
    
    // Parsers
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    // Enable CORS from client-side
    app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
    });
    
    log.info({mod: 'express'}, 'Express Initialised');   
    return app;
};
