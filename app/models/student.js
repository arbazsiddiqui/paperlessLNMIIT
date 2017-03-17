var mongoose = require('mongoose');


var studentSchema = mongoose.Schema({
    rollNumber: String,
    grades: mongoose.Schema.Types.Mixed,
    app_id: String

});

module.exports = mongoose.model('Student', studentSchema);