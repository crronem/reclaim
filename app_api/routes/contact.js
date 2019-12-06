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
        email.message = "Dear "+toName+",\n"
        email.message += "Thank you for the offer to sell your " + grade + " assets."
        email.message += "\nWe take your efforts seriously and will do our utmost to ensure your time was wisely spent."
    } else {
        email.subject = "Responding to your inquiry - sourcing/buying " + grade + " equipment"
        email.message = "Dear "+toName+",\n"
        email.message = "Thank you for your inquery to source/buy " + grade + " equipment."
        email.message += "\nWe take your efforts seriously and will do our utmost to ensure your time was wisely spent."
    }
    email.message += "\nHere is a summary of what you provided us to start with:\n\n"
    let details = formatInfo(infoObject)
    for (var i = 0; i < details.length; i++) {
        email.message += "   "+details[i]+"\n"
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

const contactInfo = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        let record = {}
        let addInfo = {}
        let email = {}
        try {
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            data.mode = req.params.mode
            data.grade = req.params.grade
            logger.info("-----contactInfo() user------")
            logger.info(JSON.stringify(user, {}, 4))
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
            logger.info("-----contactInfo() Sells/Buys record save------")
            logger.info(JSON.stringify(record, {}, 4))
            data.record = record._id
            if (!user.email) {
                let rootTag = loadTemplate("./app_api/forms/formContactInfo.pug", data) // -> contactInfo
                let response = Response.fromTag(rootTag)
                return res.json(response.toJSON())
            } else {
                email = createEmailResponse(req.params.mode, req.params.grade, user.email, user.name, req.body, record._id)
                sendeMail(email)
                data.preBody = user.name+","
                data.preBody += "\nYour request has been forwarded and we also emailed you a copy."
                data.preBody += "\nWe will be following up on your enquiry."
                data.sells = await Sells.count({ _user: user._id, active: true })
                data.buys = await Buys.count({ _user: user._id, active: true })
                // if (data.sells > 0 || data.buys > 0) {
                //     data.prebody += "\nYou have active buy/sell options."
                //     data.prebody += "\nWhat would you like to do?"
                // } else {
                //     data.preBody += "\nWhat would you like to do?"
                //     data.buys = 0
                //     data.sells = 0
                // }
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
    contactInfo,
    contactSave
}