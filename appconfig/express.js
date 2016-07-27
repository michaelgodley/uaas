var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var bunyan = require('bunyan');
var reqLog = require('bunyan-request');
var log = require('./logger').getLogger(); 
var config = require('../env/express.json');

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

    // Parsers
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Static and public assets
    app.use(express.static(config.express.publicDir));

    // Sessions and Passport
    app.use(session({
            secret: config.express.session.secret, 
            saveUninitialized: true, 
            resave: true, 
            cookie: {
                maxAge: config.express.session.cookie.maxAge
            }, 
            store: new MongoStore({
                mongooseConnection: db.connection, 
                ttl: config.express.session.store.ttl
            }
        )}
    ));
    app.use(passport.initialize());
    app.use(passport.session());

    //Misc
    app.use(flash());
    app.disable('x-powered-by');
    
    log.info({mod: 'express'}, 'Express Initialised');   
    return app;
};
