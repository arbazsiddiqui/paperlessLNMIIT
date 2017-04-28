var mongoose = require('mongoose');


var studentSchema = mongoose.Schema({
  email : String,
  rollNumber : String,
  grades : mongoose.Schema.Types.Mixed,
  subjects : [],
  batch : String,
  branch : String,
  name : String
});

module.exports = mongoose.model('Student', studentSchema);