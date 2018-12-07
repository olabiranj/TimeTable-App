let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ClassSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('classes', ClassSchema);