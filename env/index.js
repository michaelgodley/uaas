let nconf = require('nconf');

let config = {};
module.exports = config;

//Command line and env first
nconf.argv()
    .env({separator: '__'});

// JSON file config
nconf.file('log', './env/log.json');
nconf.file('db', './env/db.json');
nconf.file('expressapp', './env/expressapp.json');
nconf.file('passport', './env/passportapp.json');

// Hard defaults
nconf.defaults({ log :
		 {
		     logname: 'app',
		     src: 'false',
		     stream: {
			 level: 'trace'
		     },
		     rotatingfile: {
			 path: './logs/app.log',
			 period : '1d',
			 count: 3,
			 level: 'info'
		     }
		 },
		 db : {
		     host : 'localhost',
		     port : 27017,
		     protocol: 'mongodb',
		     name: 'app'
		 },
		 express : {
		     viewengine : 'hbs',
		     templates : './views/hbs',
		     public : './public',
		     session : {
			 secret : 'lazydog',
			 cookie : {
			     maxage : 300000
			 },
			 store : {
			     ttl: 172800
			 }
		     },
		     jwttoken: {
			 secret : 'lazydog',
			 expiresInMinutes : 5,
			 algorithm : 'HS256',
			 issuer: 'example.com',
			 audience: 'example.com'
		     }, 
		     server : {
			 host: 'localhost',
			 http : {
			     enable : true,
			     port : 3000
			 },
			 https : {
			     enable : false,
			     port : 8081,
			     sslprivatekey : './keys/key.pem',
			     sslcert : './keys/cert.pem'
			 }
		     }
		 },
		 passport : {
		     local : {
			 usernamefield : 'username',
			 passwordfield : 'password',
			 session : false,
			 passreqtocallback : false
		     },
		     token : {
			 secretorkey : 'lazydog',
			 issuer : 'example.com',
			 audience : 'example.com',
			 passreqtocallback : false
		     }
		 }
		 
	       });

nconf.set('log:rotatingfile:path', `./logs/${nconf.get('log:logname')}.log`);

// logging
config.log = {};
config.log.logname = nconf.get('log:logname');
config.log.src = nconf.get('log:src');
config.log.stream = {};
config.log.stream.level =  nconf.get('log:stream:level');
config.log.rotatingfile = {};
config.log.rotatingfile.path = nconf.get('log:rotatingfile:path');
config.log.rotatingfile.period = nconf.get('log:rotatingfile:period');
config.log.rotatingfile.count = nconf.get('log:rotatingfile:count');
config.log.rotatingfile.level = nconf.get('log:rotatingfile:level');
// db
config.db = {};
config.db.host = nconf.get('db:host');
config.db.port = nconf.get('db:port');
config.db.protocol = nconf.get('db:protocol');
config.db.name = nconf.get('db:name');
//express
config.express = {};
config.express.viewengine = nconf.get('express:viewengine');
config.express.templates = nconf.get('express:templates');
config.express.publicdir = nconf.get('express:publicdir');
config.express.session = {};
config.express.session.secret = nconf.get('express:session.secret');
config.express.session.cookie = {};
config.express.session.cookie.maxage = nconf.get('express:session.cookie.maxage'); 
config.express.session.store = {};
config.express.session.store.ttl = nconf.get('express:store:ttl');
config.express.jwttoken = {};
config.express.jwttoken.secret = nconf.get('express:jwttoken:secret');
config.express.jwttoken.expiresinminutes = nconf.get('express:jwttoken:expiresinminutes');
config.express.jwttoken.algorithm = nconf.get('express:jwttoken:algorithm');
config.express.jwttoken.issuer = nconf.get('express:jwttoken:issurer');
config.express.jwttoken.audience = nconf.get('express:jwttoken:audience');
config.express.server = {};
config.express.server.host = nconf.get('express:server:host');
config.express.server.http = {};
config.express.server.http.enable = nconf.get('express:server:http:enable');
config.express.server.http.port = nconf.get('express:server:http:port');
config.express.server.https = {};
config.express.server.https.enable = nconf.get('express:server:https:enable');
config.express.server.https.port = nconf.get('express:server:https:port');
config.express.server.https.sslprivatekey = nconf.get('express:server:https:sslprivatekey');
config.express.server.https.sslcert = nconf.get('express:server:https:sslcert');
//passport
config.passport = {};
config.passport.local = {};
config.passport.local.usernamefield = nconf.get('passport:local:usernamefield');
config.passport.local.passwordfield = nconf.get('passport:local:passwordfield');
config.passport.local.session = nconf.get('passport:local:session');
config.passport.local.passreqtocallback = nconf.get('passport:local:passreqtocallback');
config.passport.token = {};
config.passport.token.secretorkey = nconf.get('passport:token:secretorkey');
config.passport.token.issuer = nconf.get('passport:token:issuer');
config.passport.token.audience = nconf.get('passport:token:audience');
config.passport.token.passreqtocallback = nconf.get('passport:token:passreqtocallback');



