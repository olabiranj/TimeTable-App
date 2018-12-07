const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs")

let UserSchema = new Schema({
    schEmail: String,
    address: String,
    schName: String,
    adminName: String,
    password: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);