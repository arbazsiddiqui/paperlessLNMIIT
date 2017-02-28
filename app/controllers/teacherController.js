var User = require('../models/user');
var Student = require('../models/student');
var isLoggedIn = require('../middlewares/isLoggedIn');

module.exports = function (app) {

  app.get('/teacher/:id', isLoggedIn, function (req, res) {
    var id = req.params.id;
    User.find({role : 'teacher', _id : id}, function (err, teaDoc) {
      res.send(teaDoc)
    })
  });
  
  app.post('/teacher/uploadGrades', function (req, res) {
    var sub = req.body.sub;
    var file = req.body.file;
    var utf8encoded = (new Buffer(file, 'base64')).toString('utf8');
    var grades = utf8encoded.split('\n');
    grades.splice(0, 1);
    function updateStudents(rN, grade) {
      Student
        .findOne({rollNumber: rN.toLowerCase()})
        .exec(function (err, stuDoc) {
          if (err) {
            console.error(error);
          }
          if (stuDoc){
            stuDoc.grades[sub] = grade;
            stuDoc.markModified('grade');
            stuDoc.save(function (error, updatedstuDoc) {
              if (error) {
                console.error(error);
              }
            });
          }
          else {
            var newStu = new Student();
            newStu.rollNumber = rN.toLowerCase();
            newStu.grades = {};
            newStu.grades[sub] = grade;
            newStu.save(function (err) {
              if (err)
                throw err
            })
          }
        })
    }
    for (var i = 0; i<grades.length; i++){
      if (grades[i]){
        temp = grades[i].split(',');
        rN = temp[0];
        grade = temp[1];
        updateStudents(rN, grade)
      }
    }
  })
}