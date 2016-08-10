const express = require('express'),
      
      authRoutes = require('./auth/auth');

module.exports = function(app) {
    let apiRoutes = express.Router();
    apiRoutes.use('/auth', authRoutes);
    app.use('/v1', apiRoutes);
}

      
