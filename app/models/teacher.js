var mongoose = require('mongoose');


var teacherSchema = mongoose.Schema({
    email: String,
    app_id: String

});

module.exports = mongoose.model('Teacher', teacherSchema);