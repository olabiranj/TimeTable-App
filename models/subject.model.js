let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let periodSchema = new Schema({
    class_ref: {
        type: Schema.Types.ObjectId,
        ref: 'classes'
    },
    class_name: String,
    class_period: Number
})
let SubjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    periods: [periodSchema],
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('subjects', SubjectSchema);