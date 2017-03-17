/**
 * Created by wolfsgang on 17/3/17.
 */
var mongoose = require('mongoose');


var applicationSchema = mongoose.Schema({
    app_id : String,
    to_id : [String],
    from_id : String,
    type : String,
    subject : String,
    body : String
});

module.exports = mongoose.model('Application', applicationSchema);