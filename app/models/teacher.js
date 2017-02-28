var mongoose = require('mongoose');


var teacherSchema = mongoose.Schema({
  email : String
});

module.exports = mongoose.model('Teacher', teacherSchema);