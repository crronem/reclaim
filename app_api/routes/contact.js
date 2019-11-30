const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const Sells = require('../models/Model').Sells

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const contactInfo = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        let record = {}
        let addInfo = {}
        try {
            user = await Users.findOneAndUpdate({ ONEmUserId: req.user }).lean()
            data.mode = req.params.mode
            data.grade = req.params.grade
            logger.info("-----contactInfo() data------")
            logger.info(JSON.stringify(user, {}, 4))
            if (req.params.mode == "sell") {
                if (req.params.grade == "dataCenter") {
                    addInfo = new Sells({
                        _user: ObjectId(user._id),
                        grade: "dataCenter",
                        information: req.body
                    })
                } else if (req.params.grade == "commercial") {
                    addInfo = new Sells({
                        _user: ObjectId(user._id),
                        grade: "commercial",
                        information: req.body
                    })
                } else if (req.params.grade == "personal") {
                    addInfo = new Sells({
                        _user: ObjectId(user._id),
                        grade: "dataCenter",
                        information: req.body
                    })
                }
                record = await addInfo.save()
            } else { // buy
                if (req.params.grade == "dataCenter") {
                    addInfo = new Buys({
                        _user: ObjectId(user._id),
                        grade: "dataCenter",
                        information: req.body
                    })
                } else if (req.params.grade == "commercial") {
                    addInfo = new Buys({
                        _user: ObjectId(user._id),
                        grade: "commercial",
                        information: req.body
                    })
                } else if (req.params.grade == "personal") {
                    addInfo = new Buys({
                        _user: ObjectId(user._id),
                        grade: "personal",
                        information: req.body
                    })
                }
                record = await addInfo.save()
            }
            data.record = record._id
            let rootTag = loadTemplate("./app_api/forms/formContactInfo.pug", data) // -> contactInfo
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
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
        try {
            let user = await Users.findOne({ ONEmUserId: req.user }).lean()
            let options = { upsert: true, new: true }
            let query = { _id: ObjectId(req.params.record)}
            let update = { 
                name: req.body.name, 
                mobile:req.body.mobile, 
                email: req.body.email 
            }
            await Users.findOneAndUpdate(query, update, options).lean()
            query = { _id: ObjectId(req.params.record)}
            update = {_user: ObjectId(user._id)}
            if (req.params.mode == "buy") {
                record = await Buys.findOneAndUpdate(query, update, options).lean()
            } else {
                record = await Sells.findOneAndUpdate(query, update, options).lean()
            }
            email.toEmail = req.body.email
            email.toName = req.body.name
            email.fromName = "Anthony Money"
            email.fromEmail = "me@crr56.com"
            email.subject = "Inquiry to "+req.params.mode+" "+req.params.grade
            email.message = "Thank you for contacting us."
            email.message += "\n"+json.stringify(record.information)
            email.html = ""
            email.id = record._id
            logger.info("-----contactSave() data------")
            logger.info(JSON.stringify(data, {}, 4))
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