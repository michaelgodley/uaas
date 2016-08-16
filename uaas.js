const express = require('express'),
      config = require('./env'),
      log = require('./appconfig/logger'),
      passportConfig = require('./appconfig/passportapp'),
      DB = require('./appconfig/db');

// DB setup
let db = new DB(config.db.name);

// Express Setup
const app = require('./appconfig/expressapp')(db.db);

app.get('/v1', function(req, res) {
    res.send('Hello V1');
});

const router =  require('./routes')(app);

app.listen(config.express.server.http.port, function(){
    log.info({mod: 'app'}, `Express server listening on  port ${config.express.server.http.port}`);
});
