var User = require('../models/user');
var isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = function (app) {

  app.get('/student/:id', isLoggedIn, function (req, res) {
    var id = req.params.id;
    User.find({role : 'student', id : id}, function (err, stuDoc) {
      res.send(stuDoc)
    })
  })
}