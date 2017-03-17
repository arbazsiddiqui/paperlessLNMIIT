var mongoose = require('mongoose');


var studentSchema = mongoose.Schema({
    rollNumber: String,
    grades: mongoose.Schema.Types.Mixed,
    app_id: [{sent:[String],received:[String]}]

});

module.exports = mongoose.model('Student', studentSchema);