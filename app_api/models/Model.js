// const logger = require('debug-level')('anycoop')
const Mongoose = require('mongoose')
// const config = require('../common/config')

Mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setDefaultOptions);
    schema.pre('updateMany', setDefaultOptions);
    schema.pre('updateOne', setDefaultOptions);
    schema.pre('update', setDefaultOptions);
})

function setDefaultOptions() {
    this.setOptions({ runValidators: true, new: true });
}

const UserSchema = new Mongoose.Schema({
    ONEmUserId: { type: String },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    title: { type: String, default: "" },
    address: { type: String, default: "" },
    nickName: { type: String, default: "" },
    email: { type: String, default: "" },
}, {
    timestamps: true
})
const Users = Mongoose.model('users', UserSchema)

module.exports = {
    Users
}


