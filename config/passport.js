var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
var Student = require('../app/models/student');
var Teacher = require('../app/models/teacher');

module.exports = function (passport) {

    // passport session setup ==================================================
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP ============================================================
    passport.use('local-signup', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            process.nextTick(function () {

                User.findOne({'email': email}, function (err, user) {

                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false);
                    } else {
                        var newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.role = req.body.role;
                        if (req.body.role == 'student'){
                            newUser.rollNumber = req.body.rollNumber.toLowerCase();
                        }
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                        if (req.body.role == 'student'){
                            Student.findOne({rollNumber : req.body.rollNumber.toLowerCase()}, function (err, stuDoc) {
                                if (!stuDoc){
                                    var newStu = new Student();
                                    newStu.rollNumber = req.body.rollNumber.toLowerCase();
                                    newStu.save(function (err) {
                                        if (err)
                                            throw err
                                    })
                                }
                            })
                        }
                        if (req.body.role == 'teacher'){
                            var newTea = new Teacher();
                            newTea.email = email;
                            newTea.save(function (err) {
                                if (err)
                                    throw err
                            })
                        }
                    }
                });
            });
        }));

    // LOCAL LOGIN =============================================================
    passport.use('local-login', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            User.findOne({'email': email}, function (err, user) {

                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                return done(null, user);
            });

        }));
};

