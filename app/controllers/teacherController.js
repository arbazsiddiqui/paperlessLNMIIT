var User = require('../models/user');
var Student = require('../models/student');
var Application = require('../models/application');
var isLoggedIn = require('../middlewares/isLoggedIn');
var Teacher = require('../models/teacher');
module.exports = function (app) {

  app.get('/teacher/all', function (req, res) {
    Teacher.find({}, function (err, teachers) {
      var result = {};
      for (i = 0; i < teachers.length; i++) {
        var key = teachers[i].department;
        if (!result[key])
          result[key] = [];
        console.log(key);
        result[key].push(teachers[i]);
      }
      return res.json(result)
    })
  });

  app.get('/teacher/:email', function (req, res) {
    var email = req.params.email;
    Teacher.findOne({email: email}, function (err, teaDoc) {
      return res.send(teaDoc)
    })
  });

  //API to upload grades of using CSV
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
          if (stuDoc) {
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

    for (var i = 0; i < grades.length; i++) {
      if (grades[i]) {
        temp = grades[i].split(',');
        rN = temp[0];
        grade = temp[1];
        updateStudents(rN, grade)
      }
    }
  });

  //API to create an application and send it for approval
  app.post('/createapp', function (req, res) {
    var from = req.body.from;
    var approval = req.body.approval;
    var body = req.body.body;
    var approvedStatus = false;
    var pending = true;

    var newApp = new Application();
    newApp.from = from;
    newApp.approval = approval;
    newApp.body = body;
    newApp.approvedStatus = approvedStatus;
    newApp.pending = pending;
    newApp.save(function (err) {
      if (err)
        return res.send(err);

      //TODO send notification to APPROVAL
      return res.json(newApp)
    })
  });

  //API to approve an applicaion and send to all to people
  app.post('/approveApp', function (req, res) {
    var appId = req.body.id;
    var approvedStatus = req.body.approvedStatus;
    Application.findByIdAndUpdate(
      appId,
      {approvedStatus: approvedStatus, pending: false}, function (err, appDoc) {
        if (err) {
          console.log(err);
          return res.json(err)
        }
        if (approvedStatus == true) {
          //TODO send to "from"
        }
      }
    )
  });

  //API to get all the pending applications for a approval
  app.get('/allApplications/:email', function (req, res) {
    var email = req.params.email;
    Application.find({approval: email, pending: true}, function (err, appDoc) {
      return res.json(appDoc);
    });
  });

  //API for editing profile and status of teacher
  app.post('/teacher/editProfile', function (req, res) {
    var email = req.body.email;
    var status = req.body.status;
    var department = req.body.department;
    var name = req.body.name;
    Teacher.findOne({
      email: email
    }, function (err, teaDoc) {
      teaDoc.status = status;
      teaDoc.department = department;
      teaDoc.name = name;
      teaDoc.save(function (err) {
        if (err)
          return res.send(err);
        return res.json(teaDoc);
      })
    })
  });
};