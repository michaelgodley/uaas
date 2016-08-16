const jwt = require('jsonwebtoken'),
      passport = require('passport'),
      crypto = require('crypto'),
      log = require('../appconfig/logger'),
      UserProfile = require('../models/userprofile');

let authController = {
    get: function(req, res) {

    },

    login: (req, res, next) => {
	log.trace(`${req.method} ${req.url} route handler`);
	passport.authenticate('local-login', function(err, user, info) {
	    log.trace(`passport.authenticate callback for ${user}`);
	    // If error pass back to middleware
	    if(err) return next(err);
	    // If no user redirect to login
	    if(!user) return res.redirect('/auth/login');

	    // user successfully authenticated
	    req.login(user, function(err) {
		log.trace('req.login callback');
		// Any errors pass back to middleware
		if(err) return next(err);
		// user has logged in
		return res.redirect('/');
	    });
	})(req, res, next);
    },
    
    
    loginabc: (req, res) => {
	log.trace({mod: 'authController'}, '/login post');
	res.send('Auth post controller');
    },

    register: (req, res) => {
	log.trace({mod: 'authController'}, '/login post');
    }
    
};

module.exports = authController;;
