const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcryptjs');
//      log = require;

// User Profile Schema
const UserProfileSchema = new Schema(
    {
	email : {
	    type: String,
	    lowercase: true,
	    unique: true,
	    required: true
	},
	password: {
	    type: String,
	    required: true
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

/*
userSchema.pre('save', function(next) {
    log.trace('userSchema.pre save');
    // Check if modified
    //if(!this.local.isModified('password')) {
    //log.debug('Password Not Modified');
    //return next();
    //}
    
    //init encryption
    var self = this;
    log.debug('Password: %s', self.local.password);
    bcrypt.genSalt(10, function(err, salt) {
    if(err) { 
        log.debug('Error generating salt: %s', err.message);
	    return next(err);
	    }
	    // hash the password
	    bcrypt.hash(self.local.password, salt, function(err, hash) {
	        if(err) {
		log.debug('Error hashing password: %s', err.message);
		return next(err);
		    }
		        log.debug('password: %s; hash: %s ', self.local.password, hash); 
			    //override cleartest with hash
			        self.local.password = hash;
				    next();
				    });
    });
});
*/

UserProfileSchema.methods.hashPassword = function(password, next) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserProfileSchema.methods.comparePassword = function(candidatePassword, next) {
    log.trace('UserProfileSchema.comparePassword %s', candidatePassword);
    // Compare user entered password with encrypted one
    bcrypt.compare(candidatePassword, this.local.password, function(err, isMatch) {
	if(err) return next(err);
	next(null, isMatch);
    });
};

UserProfileSchema.methods.createToken = function() {
    return jwt.sign({user: this.toJSON()},
		    'lazydog',
		    {
			algorithm: 'HS256' ,
			expiresInMinutes: 5,
			issuer: 'example.com',
			audience: 'example.com',
			ignoreExpiration: false
		    }
		   );
};

module.exports = mongoose.model('UserProfile', UserProfileSchema);
