const express = require('express');
const log = require('./appconfig/logger').getLogger();
const DB = require('./appconfig/db');


let db = new DB();
const app = require('./appconfig/express')(db.db);


// Express Setup
//const app = express();

//app.get('/v1', function(req, res) {
//    res.send('Hello V1');
//});
	
//app.listen(3000, function(){
//    log.info({mod: 'app'}, 'Express server listening on  port 3000');
//});
