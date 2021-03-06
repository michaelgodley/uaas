const express = require('express'),
      bunyan = require('bunyan'),
      reqLog = require('bunyan-request'),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      log = require('./logger'),
      config = require('../env');

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

    app.use(require('express-status-monitor')({path: '/v1/status'}));
    
    // Security
    app.use(helmet());
    
    // Parsers
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // Enable Passport
    app.use(passport.initialize());
    
    // Enable CORS from client-side
    app.use((req, res, next) => {
	log.trace({mod: 'expressapp'}, 'CORS Headers middleware');
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
    });
    
    log.info({mod: 'expressapp'}, 'Express Initialised');   
    return app;
};
