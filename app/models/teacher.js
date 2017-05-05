var mongoose = require('mongoose');


var teacherSchema = mongoose.Schema({
  email : String,
  status : String,
  name : String,
  designation : String,
  title : String,
  department : String
});

module.exports = mongoose.model('Teacher', teacherSchema);