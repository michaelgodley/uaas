const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      UserProfile = require('../models/userprofile'),
      log = require('./logger'),
      config = require('../env');

// Strategies:
// Local Strategy
log.info({mod: 'passport'}, 'Setting Up Passport');
const localOpts = {};
localOpts.usernameField =  config.passport.local.usernamefield;
localOpts.passwordField = config.passport.local.passwordfield;
localOpts.session = config.passport.local.session;
localOpts.passReqToCallback = config.passport.local.passreqtocallback;
log.info({mod: 'passport'}, 'Setting Up Local Strategy Passport ' + localOpts.passReqToCallback);

const localLoginStrategy = new LocalStrategy(localOpts, function(username, password, next) {
    log.trace({mod : 'passport'}, `LocalStrategy Local-Login callback for User: ${username} Passwd:${password}`);
    UserProfile.findOne({'username': username}, function(err, user) {
	log.trace({mod: 'passport'}, `Found User: ${user}`); 
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

const localRegisterStrategy = new LocalStrategy(localOpts, (username, password, next) => {
    log.trace(`LocalStrategy Register for User: ${username} Password: ${password}`);
    process.nextTick(() => {
	UserProfile.findOne({'local.username' : username}, (err, user) => {
	    // if error return to middleware
	    if(err) {
		log.debug(`Error: ${err.message}`);
		return next(err);
	    }
	    // if user already exists return false to middleware
	    if(user) {
		log.debug(`User ${username} exists in datastore`);
		return next(null, false);
	    }
	    // New User
	    var newUser = new UserProfile();
	    newUser.local.username = username
	    newUser.local.password = UserProfile.hashPassword(password);
	    newUser.save(newUser, (err) => {
		if(err) {
		    log.debug(`Error saving user: ${err.message}`);
		    return next(err);
		}
		log.info(`Creating new user ${username}`);
		// create token

		next(null, newUser);
	    });
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
passport.use('local-register', localRegisterStrategy);
