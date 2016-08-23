const jwt = require('jsonwebtoken'),
      passport = require('passport'),
      crypto = require('crypto'),
      log = require('../appconfig/logger'),
      UserProfile = require('../models/userprofile'),
      emailService = require('../appconfig/emailservice');

let authController = {
    // Middleware Handlers
    // Token authentication middleware
    tokenAuthenticate: (req, res, next) => {
	log.trace({mod: 'authController'}, `Token Authenticate check for ${req.method} ${req.url} route handler`);
	passport.authenticate('jwt', (err, user, info) => {
	    if(err) {
		log.debug({mod: 'authController'}, `JWT authenticate error: ${err}`);
		return next(err);
	    }
	    if(!user) {
		log.debug({mod: 'authController'}, `Token Error: ${info}`);
		return next(info);
	    }
	    log.info({mod: 'authController'}, `Token verified for ${user}`)
	    req.user = user;
	    next(null, user);
	})(req, res, next);
    },

    // Local Login Handler
    loginAuthenticate: (req, res, next) => {
	log.trace({mod: 'authController'}, `Local Login Authenticate check for ${req.method} ${req.url} route handler`);
	passport.authenticate('local-login', (err, user, info) => {
	    log.trace({mod: 'authController'}, `passport.authenticate callback for ${user} ${info} ${err}`);
	    // If error pass back to middleware
	    if(err) {
		log.debug({mod: 'authController'}, `Local Login Authenticate error: ${err}`);
		return next(err);
	    }
	    // If no user redirect to login
	    if(!user) {
		log.debug({mod: 'authController'}, `Local Login Error: ${info}`);		
		return next(info);
	    }
	    // user successfully authenticated
	    req.login(user, (err) => {
		log.trace({mod: 'authController'}, 'req.login callback');
		// Any errors pass back to middleware
		if(err) {
		    log.debug({mod: 'authController'}, `Local Login Authenticate error: ${err}`);	    
		    return next(err);
		}
		// user has logged in
		log.info({mod: 'authController'}, `Local Login confirmed for ${user}`)		
		next(null, user);
	    });
	})(req, res, next);
    },

    forgotPassword: (req, res, next) => {
	log.trace({mod: 'authController'}, `Forgot Password ${req.method} ${req.url} route handler for user ${req.body.identity}`);
	UserProfile.findOne({'local.username': req.body.identity}, (err, user) => {
	    if(err) {
		log.debug({mod: 'authController'}, `Forgot Password Error: ${err.message}`);
		return next(err);
	    }
	    if(!user) {
		log.debug({mod: 'authController'}, `Forgot Password Error no user`); 
		return next(null, false);
	    }
	    crypto.randomBytes(48, (err, buffer) => {
		const resetToken = buffer.toString('hex');
		if(err) {
		    log.debug({mod: 'authController'}, `Error generating reset token: ${err.message}`);
		    return next(err);
		}
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now()+ 3600000;
		user.save((err) => {
		    if(err) {
			log.debug({mod: 'authController'}, `Error saving reset token: ${err.message}`);
			return next(err);
		    }
		    const resetLink = `http://${req.headers.host}:4000/v1/auth/resetpassword/${resetToken}`;
		    const message = {
			subject: 'Reset Password',
			text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			    Please click on the following link, or paste this into your browser to complete the process:
			${resetLink}
			If you did not request this, please ignore this email and your password will remain unchanged.\n`
		    }
		    emailService.sendEmail(user.local.username, message);
		    res.status(200).json({message: 'Please check your email for link to reset your password',
					  resetlink: resetLink});
		    next(null, user);
		});
	    });
	});
	
    },

    verifyPasswordResetToken: (req, res, next) => {
	log.trace({mod: 'authController'}, `Reset Password ${req.method} ${req.url} route handler for token ${req.params.resettoken}`);
	UserProfile.findOne({'resetPasswordToken': req.params.resettoken, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
	    if(err) {
		log.debug({mod: 'authController'},  `Password Reset Error: ${err.message}`);
		return next(err);
	    }
	    if(!user) {
		log.debug({mod: 'authController'}, `Reset Password Error no user or expired token`); 
		return next(null, false);
	    }
	    user.password = req.body.password;
	    user.resetPasswordToken = undefined;
	    user.resetPasswordExpires = undefined;

	    user.save((err) => {
		if(err) {
		    log.debug({mod: 'authController'}, `Error saving reset token: ${err.message}`);
		    return next(err);
		}
		const message = {
		    subject: 'Password Changed',
		    text: `You are receiving this email because your  password
		    If you did not request this change please contact us immediately.`
		}

		emailService.sendEmail(user.local.username, message);
		res.status(200).json({message: 'Password changed successfully. Please login in with your new password'});
		next(null, user);
	    });
	});	
    },
		     

		     
    // Route Handlers
    login: (req, res) => {
	log.trace({mod: 'authController'}, `${req.method} ${req.url} ${req.user}`);
	res.json({status : 200, token: req.user.accessToken});
    },

    register: (req, res) => {
	log.trace({mod: 'authController'}, `${req.method} ${req.url} ${req.user}`);
	res.json({status: 200, token: req.user.accessToken});
    }


};

module.exports = authController;;
