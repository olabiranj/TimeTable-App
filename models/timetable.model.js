let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TimetableSchema = new Schema({
    subject: {
        type: String,
        uppercase: true
    },
    classname: {
        type: String,
        required: true,
        uppercase: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    day: {
        type: String,
        required: true,
        uppercase: true
    },
    period: {
        type: String,
        required: true,
        uppercase: true
    }
    
});

module.exports = mongoose.model('timetable', TimetableSchema);