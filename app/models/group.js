var mongoose = require('mongoose');


var groupSchema = mongoose.Schema({
  name : String,
  members : [],
  admin : String
});

module.exports = mongoose.model('Group', groupSchema);