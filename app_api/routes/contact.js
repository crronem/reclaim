const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const { sendeMail } = require('../routes/email')
const Sells = require('../models/Model').Sells

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const { titleCase, formatInfo } = require('../routes/utility')

const createEmailResponse = function (mode, grade, toEmail, toName, infoObject, recordId) {
    let email = {}
    email.toEmail = toEmail
    email.toName = toName
    email.fromName = "Reclaim UK"
    email.fromEmail = "me@crr56.com"
    if (mode == "sell") {
        email.subject = "Responding to your inquiry - selling your " + grade + " assets"
        email.message = "Dear " + toName + ",\n"
        email.message += "Thank you for the offer to sell your " + grade + " assets."
        email.message += "\nWe take your efforts seriously and will do our utmost to ensure your time was wisely spent."
    } else {
        email.subject = "Responding to your inquiry - sourcing/buying " + grade + " equipment"
        email.message = "Dear " + toName + ",\n"
        email.message = "Thank you for your inquery to source/buy " + grade + " equipment."
        email.message += "\nWe take your efforts seriously and will do our utmost to ensure your time was wisely spent."
    }
    email.message += "\nHere is a summary of what you provided us to start with:\n\n"
    let details = formatInfo(infoObject)[0]
    for (var i = 0; i < details.length; i++) {
        email.message += "   " + details[i] + "\n"
    }
    email.message += "\n\nYou can see your enquiry and message us at any time."
    email.message += "\nSimply revisit our website."
    email.message += "\n\n" + "In the mean time, we will get back to you soon."
    email.message += "\n\n" + "At your service..."
    email.message += "\n\n" + "Sincerely,"
    email.message += "\n\n" + "Anthony Money - Owner UK-Reclaim"
    email.html = "<a href='https://reclaim-uk.com/'>Reclaim UK Website</a>"
    email.id = recordId
    return email
}

const contactList = function () {
    return async function (req, res) {
        let data = {}
        try {
            //data.contacts = await Users.find().lean()
            data.contacts = await Users.aggregate(
                [
                    {
                        $lookup: {
                            from: "messages",
                            localField: "_id",
                            foreignField: "_user",
                            as: "messages"
                        }
                    }
                ]
            )
            logger.info("-----contactList() user------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/contactList.pug", data) // -> contactInfo
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (err) {
            logger.info("-----contactList() Error------")
            console.log(err)
        }
    }
}

const contactShow = function () {
    return async function (req, res) {
        let data = {}
        try {
            //data.contacts = await Users.find().lean()
            data.contacts = await Users.aggregate(
                [
                    {
                        $lookup: {
                            from: "messages",
                            localField: "_id",
                            foreignField: "_user",
                            as: "messages"
                        }
                    }, {
                        $match: {
                            _user: req.params.id
                        }
                    }, {
                        $project:
                        {
                            name: 1,
                            email: 1,
                            mobile: 1,
                            "messages": 1
                        }
                    }
                ]
            )
            for (var i = 0; i < data.contacts.length; i++) {
                if (data.contacts[i].messages.length > 0) {
                    for (var j = 0; j < data.contacts[i].messages.length; j++) {
                        data.contacts[i].messages[j].createdAt = moment(data.contacts[i].messages[j].createdAt).format('MMM DD YYYY HH:mm')
                    }
                }
            }
            logger.info("-----contactShow() user------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/contactShow.pug", data) // -> contactInfo
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (err) {
            logger.info("-----contactList() Error------")
            console.log(err)
        }
    }
}

const contactEdit = function () {
    return async function (req, res) {
        let data = {}
        try {
            //data.contacts = await Users.find().lean()
            data.contacts = await Users.findOne({ _id: req.params.id })
            logger.info("-----contactEdit() user------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formContactEdit.pug", data) // -> contactInfo
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (err) {
            logger.info("-----contactEdit() Error------")
            console.log(err)
        }
    }
}

const contactUpdate = function () {
    return async function (req, res) {
        let data = {}
        try {
            await Users.findOneAndUpdate(
                {
                    _id: req.params.id
                },
                {
                    name: req.body.name,
                    mobile: req.body.mobile,
                    email: req.body.email
                }
            )
            logger.info("-----contactUpdate() user------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/contactEdit.pug", data) // -> contactInfo
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (err) {
            logger.info("-----contactUpdate() Error------")
            console.log(err)
        }
    }
}

const contactInfo = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        let sell = {}
        let buy = {}
        let record = {}
        let addInfo = {}
        let email = {}
        try {
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            data.mode = req.params.mode
            data.grade = req.params.grade
            logger.info("-----contactInfo() user------")
            logger.info(JSON.stringify(user, {}, 4))
            if (req.params.id == 0) {
                if (req.params.mode == "sell") {
                    addInfo = new Sells({
                        _user: ObjectId(user._id),
                        grade: req.params.grade,
                        information: req.body,
                        active: true
                    })
                } else { // buy
                    addInfo = new Buys({
                        _user: ObjectId(user._id),
                        grade: req.params.grade,
                        information: req.body,
                        active: true
                    })
                }
                record = await addInfo.save()
                data.preBody = user.name + ","
                data.preBody += "\nYour request has been forwarded and we also emailed you a copy."
                data.preBody += "\nWe will be following up on your enquiry."
                logger.info("-----contactInfo() Sells/Buys record save------")
                logger.info(JSON.stringify(record, {}, 4))
                data.record = record._id
                // if (!user.email) {
                //     let rootTag = loadTemplate("./app_api/forms/formContactInfo.pug", data) // -> contactInfo
                //     let response = Response.fromTag(rootTag)
                //     return res.json(response.toJSON())
                // } else {
                //     email = createEmailResponse(req.params.mode, req.params.grade, user.email, user.name, req.body, record._id)
                //     sendeMail(email)

                //     data.sells = await Sells.count({ _user: user._id, active: true })
                //     data.buys = await Buys.count({ _user: user._id, active: true })
                //     let rootTag = loadTemplate("./app_api/menus/landing.pug", data) // -> sellGrade
                //     let response = Response.fromTag(rootTag)
                //     return res.json(response.toJSON())
                // }
            } else {
                if (req.params.mode == "sell") {
                    query = { _id: ObjectId(req.params.id) }
                    update = {
                        information: req.body,
                    }
                    options = { new: true }
                    record = await Sells.findOneAndUpdate(query, update).lean()
                } else { // buy
                    query = { _id: ObjectId(req.params.id) }
                    update = {
                        information: req.body,
                    }
                    options = { new: true }
                    record = await Buys.findOneAndUpdate(query, update).lean()
                }
                data.preBody = user.name + ","
                data.preBody += "\nYour request has been revised and we also emailed you a copy."
                data.preBody += "\nWe will be following up on your revised enquiry."
                logger.info("-----contactInfo() Sells/Buys record save------")
                logger.info(JSON.stringify(record, {}, 4))
            }
            if (!user.email) {
                let rootTag = loadTemplate("./app_api/forms/formContactInfo.pug", data) // -> contactInfo
                let response = Response.fromTag(rootTag)
                return res.json(response.toJSON())
            } else {
                email = createEmailResponse(req.params.mode, req.params.grade, user.email, user.name, req.body, record._id)
                sendeMail(email)
                data.sells = await Sells.count({ _user: user._id, active: true })
                data.buys = await Buys.count({ _user: user._id, active: true })
                let rootTag = loadTemplate("./app_api/menus/landing.pug", data) // -> sellGrade
                let response = Response.fromTag(rootTag)
                return res.json(response.toJSON())
            }
        } catch (error) {
            logger.info("-----contactInfo() Error------")
            console.log(error)
        }
    }
}

const contactSave = function () {
    return async function (req, res) {
        let data = {}
        let email = {}
        let record = {}
        let user = {}
        let options = {}
        let query = {}
        let update = {}
        try {
            logger.info("-----contactSave() req.body------")
            logger.info(JSON.stringify(req.body, {}, 4))
            logger.info("-----contactSave() req.params------")
            logger.info(JSON.stringify(req.params, {}, 4))
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            options = { new: true }
            query = { _id: ObjectId(user._id) }
            update = {
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email
            }
            await Users.findOneAndUpdate(query, update, options).lean()
            logger.info("-----contactSave() user findOneAndUpdate------")
            logger.info(JSON.stringify(user, {}, 4))

            if (req.params.mode == "sell") {
                record = await Sells.findOne({ _id: ObjectId(req.params.record) }).lean()
            } else {
                record = await Buys.findOne({ _id: ObjectId(req.params.record) }).lean()
            }
            email = createEmailResponse(req.params.mode, req.params.grade, user.email, user.name, record.information, record._id)
            sendeMail(email)
            data.prebody = "Your request has been forwarded and we also emailed you a copy!"
            let rootTag = loadTemplate("./app_api/menus/landing.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyDataCenter() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    contactList,
    contactShow,
    contactEdit,
    contactUpdate,
    contactInfo,
    contactSave
}