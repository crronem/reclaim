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
    name: { type: String, default: "" },
    mobile: { type: String, default: "" },
    email: { type: String, default: "" }
}, {
    timestamps: true
})
const Users = Mongoose.model('users', UserSchema)

const BuysSchema = new Mongoose.Schema({
    _user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }, 
    grade: { type: String},
    information: { type: Object},
    active: {type: Boolean}
}, {
    timestamps: true
})
const Buys = Mongoose.model('buys', BuysSchema)

const SellsSchema = new Mongoose.Schema({
    _user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }, 
    grade: { type: String},
    information: { type: Object},
    active: {type: Boolean}
}, {
    timestamps: true
})
const Sells = Mongoose.model('sells', SellsSchema)

const MessagesSchema = new Mongoose.Schema({
    _sell: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'sells',
        required: false
    }, 
    _buy: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'buys',
        required: false
    }, 
    message: { type: String},
    subject:  { type: String}
}, {
    timestamps: true
})
const Messages = Mongoose.model('messages', MessagesSchema)

// const ContactsSchema = new Mongoose.Schema({
//     name: { type: String},
//     email: { type: String},
//     mobile: { type: String}
// }, {
//     timestamps: true
// })
// const Contacts = Mongoose.model('contacts', ContactsSchema)

module.exports = {
    Users,
    Buys,
    Sells,
    Messages
}


