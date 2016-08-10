const express = require('express'),
      log = require('../../appconfig/logger');

module.exports = function() {
    log.trace({mod: 'routes'}, '/auth routes setup');
    let router = express.Router();
    router.route('/login').post((req,res) => {
	res.send('Auth post route');
    })
	.get((req, res) => {
	    res.send('Auth get Route');
	});

    
    router.route('/register').post((req, res) => {

    });
		 
    return router
}


