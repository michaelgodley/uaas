const express = require('express'),
      authentication = require('../../controllers/authentication'),
      log = require('../../appconfig/logger');

log.trace({mod: 'routes'}, '/index routes setup');
const router = express.Router();

// Auth Token middleware
router.all('*', authentication.tokenAuthenticate);

router.get('/test', (req, res) => {
    log.trace({mod: 'approute'}, 'token route');
    res.json({tokenstatus: 'ok', token: req.user, method: req.method});
});

router.post('/test', (req, res) => {
    log.trace({mod: 'approute'}, 'token route');
    res.json({tokenstatus: 'ok', token: req.user, method: req.method});
});

module.exports = router;
