var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var token = req.get('x-access-token');
    console.log(token);
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'tokensecretkey', function (err, decoded) {
            console.log(decoded);
            var actualTimeInSeconds = new Date().getTime() / 1000;
            if (err) {
                err = {
                    name: 'TokenExpiredError',
                    message: 'jwt expired',
                    expiredAt: actualTimeInSeconds
                }
                res.status(400).send('Access token has expired. Failed to authenticate token.Please Login again.');
            }
            else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        // if there is no token return an error
        res.status(403).send('No token provided.');
    }
}
