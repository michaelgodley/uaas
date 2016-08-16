const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      UserProfile = require('../models/userprofile'),
      config = require('../env');

// Strategies:
// Local Strategy
const localOpts = {};
localOpts.usernameField =  config.passport.local.usernamefield;
localOpts.passwordField = config.passport.local.passwordfield;
localOpts.session = config.passport.local.session;
localOpts.passReqToCallback = config.passport.local.passreqtocallback;

const localLoginStrategy = new LocalStrategy(localOpts, function(username, password, next) {
    log.trace({mod : 'passportapp'}, `LocalStrategy Login callback for User:${username} Passwd:${password}`);
    UserProfile.findOne({'username': username}, function(err, user) {
	// if error return to middleware
	if(err) return next(err);
	// if no user indicate false to local strategy
	if(!user) return next(null, false);
	// A matched user
	user.comparePassword(password, function(err, isMatch) {
	    if(err) {
		return next(err);
	    }
	    if(isMatch) {
		return next(null, user);
	    } else {
		return next(null, false, { error: 'Your login details could not be verified'});
	    }
	});
    });	      
});

/*
const tokenOpts = {};
tokenOpts.jwtFromRequest = ExtractJwt.fromAuthHeader();
tokenOpts.secretOrKey = config.passport.token.secretorkey;
tokenOpts.issuer = config.passport.token.issuer;
tokenOpts.audience = config.passport.token.audience;
tokenOpts.passReqToCallback = config.passport.token.passreqtocallback;

const tokenStrategy = new JwtStrategy(tokenOpts, function(payload, next) {
    log.trace('JwtStrategy callback for payload ' + payload);
    // next();
    UserProfile.findOne({'username': payload.user.username}, function(err, user) {
	if (err) {
	    log.debug('Error %s', err.message);
	    return next(err);
	}
	if (user) {
	    next(null, user);
	} else {
	    next(null, false);
	    // or you could create a new account
	}
    });
});
*/
//passport.use('token', tokenStrategy);

passport.use('local-login', localLoginStrategy);
