const express = require('express'),
      log = require('../appconfig/logger'),
      authRoutes = require('./auth/auth');

module.exports = function(app) {
    log.trace({mod: 'routes'}, 'Setting up routes for application');
    let apiRoutes = express.Router();
    apiRoutes.use('/auth', authRoutes);
    app.use('/v1', apiRoutes);
//    app.use('/v1/auth', authRoutes);
}

      
