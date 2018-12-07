let passport = require("passport");
let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    })
})

passport.use('local.registerUser',
    new LocalStrategy({
        usernameField: "schEmail",
        passwordField: "password",
        passReqToCallback: true
    },
    function (req, schEmail, password, done) {
        User.findOne({ 'schEmail': schEmail }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                req.flash('error', 'User account exist, login instead');
                return done(null, false)
            }

            let newUser = new User();
            newUser.schEmail = req.body.schEmail;
            newUser.address = req.body.address;
            newUser.schName = req.body.schName;
            newUser.adminName = req.body.adminName
            newUser.password = newUser.generateHash(req.body.password);

            newUser.save(function (err) {
                if (err) {
                    return done(err)
                }

                return done(null, newUser)
            })
        })
    })
);


passport.use('local.loginUser',
    new LocalStrategy({
        usernameField: "schEmail",
        passwordField: "password",
        passReqToCallback: true
    },
    function (req, schEmail, password, done) {
        User.findOne({ 'schEmail': schEmail}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                req.flash('error', "User record not found!");
                return done(null, false)
            }
            if (!user.validatePassword(password)) {
                req.flash('error', 'Invalid user password!');
                return done(null, false)
            }
            return done(null, user)
        })
    })
)
