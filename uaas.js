const express = require('express'),
      config = require('./env'),
      log = require('./appconfig/logger'),
      DB = require('./appconfig/db');

// Passport setp
const passportConfig = require('./appconfig/passportapp');

// DB setup
let db = new DB(config.db.name);

db.db.connection.on('connected', (err) => {
    let acl = require('./controllers/aclcontroller');
});

// Express Setup
const app = require('./appconfig/expressapp')(db.db);

app.get('/v1', function(req, res) {
    res.json({status: 'OK'});
});

const router =  require('./routes')(app);

// Error Handling Middleware
app.use((err, req, res, next) => {
    log.trace({mod: 'expressapp'}, `Error: ${err}`);
    res.status(422).json({Error: err.message, status: 500});
    //    next();
});

app.listen(config.express.server.http.port, function(){
    log.info({mod: 'app'}, `Express server listening on  port ${config.express.server.http.port}`);
});
