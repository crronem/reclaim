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
    grade: { type: String },
    information: { type: Object },
    active: { type: Boolean },
    new: { type: Boolean, default: true }
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
    grade: { type: String },
    information: { type: Object },
    active: { type: Boolean },
    new: { type: Boolean, default: true }
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
    message: { type: String },
    subject: { type: String }
}, {
    timestamps: true
})
const Messages = Mongoose.model('messages', MessagesSchema)

const TemplatesSchema = new Mongoose.Schema({
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    variables: { type: String, default: "" },
    values: { type: Object, default: {} }
}, {
    timestamps: true
})
const Templates = Mongoose.model('templates', TemplatesSchema)

const AdminsSchema = new Mongoose.Schema({
    _user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    name: { type: String},
    password: { type: String},
    admin: {type: String},
    access: {type: Object}
}, {
    timestamps: true
})
const Admins = Mongoose.model('admins', AdminsSchema)

module.exports = {
    Users,
    Buys,
    Sells,
    Messages,
    Templates,
    Admins
}


