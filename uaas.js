const express = require('express');
const DB = require('./appconfig/db');
const config = require('./env');
const log = require('./appconfig/logger').getLogger();

// DB setup
let db = new DB(config.db.name);

// Express Setup
const app = require('./appconfig/express')(db.db);

app.get('/v1', function(req, res) {
    res.send('Hello V1');
});
	
app.listen(config.express.server.http.port, function(){
    log.info({mod: 'app'}, `Express server listening on  port ${config.express.server.http.port}`);
});
