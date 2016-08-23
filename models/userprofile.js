const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcryptjs'),
      jwt= require('jsonwebtoken'),
      log = require('../appconfig/logger'),
      config = require('../env');

// User Profile Schema
const UserProfileSchema = new Schema(
    {
	local : {
	    username : {
		type: String,
		unique: true,
		required: true
	    },
	    emailAddr : {
		type: String,
		lowercase: true
	    },
	    password: {
		type: String,
		required: true
	    },
	},
	profile: {
	    firstName: {
		type: String
	    },
	    lastName: {
		type: String
	    }
	},
	role: {
	    type: String,
	    enum: ['Member', 'Client', 'Owner', 'Admin'],
	    default: 'Member'
	},
	accessToken: {
	    type: String
	},
	resetPasswordToken: {
	    type: String
	},
	resetPasswordExpires: {
	    type: Date
	}
    },
    {
	timestamps:true
    }
);

UserProfileSchema.methods.hashPassword = function(password) {
    log.trace({mod: 'db'}, 'UserProfile.hashPassword');
    this.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    return; 
};

UserProfileSchema.methods.comparePassword = function(candidatePassword, cb) {
    log.trace('UserProfileSchema.comparePassword');
    // Compare user entered password with encrypted one
    bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => { 
	if (err) {
	    return cb(err);
	}
	cb(null, isMatch);
    });
};

UserProfileSchema.methods.createToken = function() {
    this.accessToken =  jwt.sign({user: this.local.username,
				  role: this.role
				 },
				 'lazydog',
				 {
				     algorithm: 'HS256' ,
				     expiresIn: 86400,
				     issuer: 'example.com',
				     audience: 'example.com'
				 }
				);
};

module.exports = mongoose.model('UserProfile', UserProfileSchema);
