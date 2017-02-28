var isLoggedIn = require('../middlewares/isLoggedIn');
var authenticated_using = require('../helpers/authenticated_using')

module.exports = function (app, passport) {
    
    app.post('/login', passport.authenticate('local-login', {}),
    function (req, res) {
        res.send(req.user)
    });
    
    app.post('/signup', passport.authenticate('local-signup', {}),
    function (req, res) {
        res.send(req.user)
    });

    // LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
};