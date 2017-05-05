var User = require('../models/user');
var Student = require('../models/student');
var isLoggedIn = require('../middlewares/isLoggedIn');
var Group = require('../models/group');
module.exports = function (app) {

  app.get('/student/:rollNumber', function (req, res) {
    var rollNumber = req.params.rollNumber;
    Student.findOne({rollNumber : rollNumber}, function (err, stuDoc) {
      return res.send(stuDoc)
    })
  });

  //API to edit student profile which will automatically make him join group
  app.post('/student/editProfile', function (req, res) {
    var roll = req.body.roll;
    var subjects = req.body.subjects;
    var batch = req.body.batch;
    var branch = req.body.branch;
    var name = req.body.name;
    Student.findOne({
      rollNumber : roll
    }, function (err, stuDoc) {
      stuDoc.subjects = subjects;
      stuDoc.batch = batch;
      stuDoc.branch = branch;
      stuDoc.name = name;
      stuDoc.save(function (err) {
        if(err)
          return res.send(err);
        joinGroups(stuDocs, function (success) {
          return res.send(stuDoc);
        })
      })
    })
  });

  //function to join groups
  var joinGroups = function (student, callback) {
    var groups = student.subjects;
    groups.push(branch);
    groups.push(batch);
    count = 0;
    for(i=0; i<groups.length; i++){
      joinGroup(groups[i], student.rollNumber, function (success) {
        count = count +1;
        if(count == groups.length)
          return callback("success");
      });
    }
  };

  //function to join group async
  var joinGroup = function (sub, rollNumber, callback) {
    Group.findOne({
      name : sub
    }, function (err, groupDoc) {
      groupDoc.members.push(rollNumber);
      groupDoc.save(function (err) {
        return callback("success");
      })
    })
  }
};