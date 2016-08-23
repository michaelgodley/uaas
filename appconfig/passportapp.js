const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      UserProfile = require('../models/userprofile'),
      log = require('./logger'),
      config = require('../env');

// Strategies:
// Local Strategy
log.trace({mod: 'passport'}, 'Setting Up Passport Strategies');
const localOpts = {};
localOpts.usernameField =  config.passport.local.usernamefield;
localOpts.passwordField = config.passport.local.passwordfield;
localOpts.session = config.passport.local.session;
localOpts.passReqToCallback = config.passport.local.passreqtocallback;

const localLoginStrategy = new LocalStrategy(localOpts, function(username, password, next) {
    log.trace({mod : 'passport'}, `LocalStrategy Local-Login callback for User: ${username}`);
    UserProfile.findOne({'local.username': username}, function(err, user) {
	log.trace({mod: 'passport'}, `Found User: ${user.local.username}`); 
	// if error return to middleware
	if(err) {
	    log.debug({mod : 'passport'}, `Error: ${err.message}`); 
	    return next(err);
	}
	// if no user indicate false to local strategy
	if(!user) {
	    log.debug({mod : 'passport'}, `Error: No user found`); 
	    return next(null, false);
	}
	// A matched user
	user.comparePassword(password, function(err, isMatch) {
	    if(err) {
		log.debug({mod : 'passport'}, `Error: ${err.message}`);
		return next(err);
	    }
	    if(isMatch) {
		log.info({mod : 'passport'}, `User: ${user.local.username} logged in`);
		return next(null, user);
	    } else {
		log.debug({mod : 'passport'}, 'Error: Login password details not verified');		
		return 	next(null, false, { error: 'Your login details could not be verified'});
	    }
	});
    });	      
});

const localRegisterStrategy = new LocalStrategy(localOpts, (username, password, next) => {
    log.trace({mod : 'passport'}, `LocalStrategy Register for User: ${username}`);
    process.nextTick(() => {
	UserProfile.findOne({'local.username' : username}, (err, user) => {
	    // if error return to middleware
	    if(err) {
		log.debug({mod : 'passport'}, `Error: ${err.message}`);
		return next(err);
	    }
	    // if user already exists return false to middleware
	    if(user) {
		log.debug({mod : 'passport'}, `User ${username} exists in datastore`);
		return next(null, false);
	    }
	    // New User
	    var newUser = new UserProfile();
	    newUser.local.username = username;
	    newUser.hashPassword(password);
	    newUser.createToken();
	    newUser.save(newUser, (err) => {
		if(err) {
		    log.debug({mod : 'passport'}, `Error saving user: ${err.message}`);
		    return next(err);
		}
		log.info({mod : 'passport'}, `Created new user ${username}`);
		// create token
		return next(null, newUser);
	    });
	});
    });
});

// Token Strategy
var fromCookie = () => {
    return function(req) {
	var token = null;
	if (req && req.cookies) {
	    token = req.cookies['jwt'];
	}
	return token;
    }
};

const extractors = [
    ExtractJwt.fromAuthHeader(),
    ExtractJwt.fromUrlQueryParameter('auth_token'),
    ExtractJwt.fromHeader('x-auth-token'),
    fromCookie(),
    ExtractJwt.fromBodyField('auth_token')
];

const tokenOpts = {};
tokenOpts.jwtFromRequest = ExtractJwt.fromExtractors(extractors);
tokenOpts.secretOrKey = config.passport.token.secretorkey;
tokenOpts.issuer = config.passport.token.issuer;
tokenOpts.audience = config.passport.token.audience;
tokenOpts.passReqToCallback = config.passport.token.passreqtocallback;

const tokenStrategy = new JwtStrategy(tokenOpts, function(payload, next) {
    log.trace(`JwtStrategy callback for payload ${payload.user}`);
    UserProfile.findOne({'local.username': payload.user}, function(err, user) {
	if (err) {
	    log.debug({mod : 'passport'}, `Error ${err.message}`);
	    return next(err);
	}
	if (user) {
	    log.info({mod : 'passport'}, `Identified Token for User ${user.local.username}`);
	    next(null, user.accessToken);
	} else {
	    log.debug({mod : 'passport'}, `Error: No User for token presented`);
	    return next(null, false);
	}
    });
});

passport.use('jwt', tokenStrategy);
passport.use('local-login', localLoginStrategy);
passport.use('local-register', localRegisterStrategy);
