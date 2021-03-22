var express = require('express');
var request = require('request');
var passport = require('passport');
var router = express.Router();

router.route('/login')
.post(function (req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function (err, user, token) {
        if (err) {
            return res.status(401).send({ message: 'authentication failed' });
        }
        if (!user) {
            return res.status(401).send({ success: false, message: 'authentication failed' });
        }
        req.login(user, function (err) {
            if (err) {
                return res.status(401).send({ message: 'authentication failed' });
                //return next(err);
            }
            return res.status(200).send({ success: true, userInfo: user,token: token });
        });
    })(req, res, next);
});

module.exports = router;