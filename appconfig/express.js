var express = require('express');
var bunyan = require('bunyan');
var reqLog = require('bunyan-request');
var helmet = require('helmet');
var log = require('./logger').getLogger(); 
var config = require('../env');

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
    //app.use(bodyParser.json());
    //app.use(bodyParser.urlencoded({ extended: false }));
    
    log.info({mod: 'express'}, 'Express Initialised');   
    return app;
};
