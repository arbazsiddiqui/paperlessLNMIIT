var mongoose = require('mongoose');


var applicationSchema = mongoose.Schema({
  from : String,
  to : mongoose.Schema.Types.Mixed,
  approval : String,
  body : String,
  approvedStatus : Boolean,
  pending : Boolean
});

module.exports = mongoose.model('Application', applicationSchema);