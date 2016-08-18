const express = require('express'),
      passport = require('passport'),
      authentication = require('../../controllers/authentication'),
      log = require('../../appconfig/logger');

log.trace({mod: 'routes'}, '/auth routes setup');
const router = express.Router();


router.post('/register', passport.authenticate('local-register', {session: false}), authentication.register);
router.post('/login', passport.authenticate('local-login', {session: false}), authentication.login);


router.get('/test', passport.authenticate('jwt',{session: false}), (req, res) => {
    log.trace({mod: 'auth'}, 'token route');
    res.json({token: 'ok'});
});


router.get('/login',  (req, res, next) => {
    log.trace({mod: 'auth'}, '/login get middleware');
    next();
});

router.get('/login', (req, res) => {
    log.trace({mod: 'auth'}, '/login get');
    res.send('Auth get Route');
});

router.route('/register').post((req, res) => {

});

module.exports = router;
