var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');//creating token
var ObjectID = require('mongodb').ObjectID;


module.exports = function (passport) {
    //Passport Authentication
    passport.use(new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'Email',
            passwordField: 'Password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function (req, Email, Password, done) {

            var db = req.db;
            var Students = db.collection("Students");
            var loginData = req.body;
            console.log(loginData," loginData")
            try {
                // find the Students
                Students.findOne({ email: Email }, function (err, user) {
                    console.log(user);
                    if (err) throw err;
                    if (!user) {
                        console.log('Authentication failed. User not found.');
                        return done(null, false, { msg: 'Incorrect Email.' });
                    } else if (user) {
                        var password = user.password;

                        var userInfo = new Object();
                        userInfo.userId = user._id;
                        userInfo.fullname = user.fullname;
                        userInfo.email = user.email;
                        // check if password matches
                        if (loginData.Password != password) {
                            console.log('Authentication failed. Wrong password.');
                            return done(null, false, { msg: 'Incorrect password.' });
                        } else {
                            // if user is found and password is right
                            // create a token
                            var token = jwt.sign({
                                id: user._id
                            }, "tokensecretkey", { expiresIn: 604800 });//7days=604800 seconds
                            return done(null, userInfo, token);
                        }
                    }
                });
            } catch (e) {
                console.log("catch error in passport authentication : " + e);
            }
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user);
    });// passport.serializeUser is invoked allowing us the specify what user information should be stored in the session.

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });//passport.deserializeUser is invoked on every request by passport.session. It enables us to load additional user information on every request. This user object is attached to the request as req.user making it accessible in our request handling.

    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.send(401);
    }

}
