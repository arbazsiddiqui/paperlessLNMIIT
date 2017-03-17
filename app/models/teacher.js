var mongoose = require('mongoose');


var teacherSchema = mongoose.Schema({
    email: String,
    app_id: [{sent:[String],received:[String]}]

});

module.exports = mongoose.model('Teacher', teacherSchema);