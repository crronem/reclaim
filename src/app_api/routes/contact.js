const logger = require('debug-level')('reclaim')
const config = require('../common/config')
const info = require('../common/contact')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const { sendeMail } = require('../routes/email')
const Sells = require('../models/Model').Sells
const Admins = require('../models/Model').Admins

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const { sentenceCase, formatInfo, titleCase } = require('../routes/utility')

const createEmailResponse = function (mode, grade, toEmail, toName, infoObject, recordId, type) {
    let email = {}
    email.toEmail = toEmail
    email.toName = toName
    email.fromName = `${config.emailName}`
    email.fromEmail = `${config.emailFrom}`
    if (mode == "sell") {
        if (type != "revised"){
            email.subject = "Responding to your enquiry - selling your " + sentenceCase(grade) + " assets"
        } else {
            email.subject = "Your revised enquiry - selling your " + sentenceCase(grade) + " assets"
        }
        if (toName) {
            email.message = "Dear " + sentenceCase(toName) + ","
        } else {
            email.message = "Dear Customer,"
        }  
        if (type != "revised"){
            email.message += "\n\nThank you for the offer to sell your " + sentenceCase(grade) + " assets."
        } else {
            email.message += "\n\nYour revised sell offer for " + sentenceCase(grade) + " assets has been updated."
        }
      
    } else {
        if (type != "revised"){
            email.subject = "Responding to your enquiry - buying " + sentenceCase(grade) + " equipment"
        } else {
            email.subject = "Your revised enquiry - buying " + sentenceCase(grade) + " equipment"
        }
        if (toName) {
            email.message = "Dear " + sentenceCase(toName) + ","
        } else {
            email.message = "Dear Customer,"
        }  
        if (type != "revised"){
            email.message += "\n\nThank you for your enquiry to buy " + sentenceCase(grade) + " equipment."
        } else{
            email.message += "\n\nYour enquiry to source/buy " + sentenceCase(grade) + " equipment has been updated."
        }
    }
    if (type != "revised"){
        email.message += "\n\nHere is a summary of what you provided:\n\n"
    } else {
        email.message += "\n\nHere is your revised summary:\n\n"
    }
    let infoDetails = formatInfo(infoObject)
    for (var i = 0; i < infoDetails[0].length; i++) {
        if (infoDetails[2][i] !== ""){
            email.message += "   " + infoDetails[0][i] + "\n"
        }    
    }
    if (type != "revised"){
        email.message += "\nYou can see your enquiry and revise it at any time."
        email.message += `\nSimply revisit our website ${config.webSite}.`
        email.message += "\n\n" + "We will get back to you soon."
    } else {
        email.message += "\nYour enquiry has been updated."
        email.message += `\nSee your account at ${config.webSite}.`
    }
    
    email.message += "\n\n" + "Sincerely,"
    email.message += "\n\n" + config.emailName
    email.message += "\n"+ config.webSite
    email.message += "\n"+ info.address
    email.id = recordId
    logger.info("-----createEmailResponse() email------")
    logger.info(JSON.stringify(email, {}, 4))    
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
            let rootTag = loadTemplate("./src/app_api/menus/contactList.pug", data) // -> contactInfo
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
            let rootTag = loadTemplate("./src/app_api/menus/contactShow.pug", data) // -> contactInfo
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
            let rootTag = loadTemplate("./src/app_api/forms/formContactEdit.pug", data) // -> contactInfo
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
            let rootTag = loadTemplate("./src/app_api/menus/contactEdit.pug", data) // -> contactInfo
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
        let type = "standard"
        let record = {}
        let addInfo = {}
        let email = {}
        try {
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            data.mode = req.params.mode
            data.grade = req.params.grade
            logger.info("-----contactInfo() user------")
            logger.info(JSON.stringify(user, {}, 4))
            logger.info("-----contactInfo() body------")
            logger.info(JSON.stringify(req.body, {}, 4))
            if (req.params.id == 0) {
                // New user
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
                data.preBody = "Thank you "+titleCase(user.name) + ","
                data.preBody += "\nYour request has been successfully submitted and we will be in touch shortly."
                logger.info("-----contactInfo() Sells/Buys record save------")
                logger.info(JSON.stringify(record, {}, 4))
                data.record = record._id
            } else {
                // Existing user
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
                type = "revised"
                data.preBody = user.name + ","
                data.preBody += "\nYour request has been revised and we emailed you a copy."
                data.preBody += "\nWe will be following up on your revised enquiry."
                logger.info("-----contactInfo() Sells/Buys record save------")
                logger.info(JSON.stringify(record, {}, 4))
            }
            if (!user.email) {
                // No email so go get
                let rootTag = loadTemplate("./src/app_api/forms/formContactInfo.pug", data) // -> contactInfo
                let response = Response.fromTag(rootTag)
                return res.json(response.toJSON())
            } else {
                email = createEmailResponse(req.params.mode, req.params.grade, user.email, user.name, req.body, record._id, type)
                logger.info("-----contactInfo() email ------")
                logger.info(JSON.stringify(email, {}, 4))
                await sendeMail(email)
                data.sells = await Sells.countDocuments({ _user: user._id, active: true })
                data.buys = await Buys.countDocuments({ _user: user._id, active: true })
                let rootTag = loadTemplate("./src/app_api/menus/landing.pug", data) // -> sellGrade
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
            user = await Users.findOneAndUpdate(query, update, options).lean()
            logger.info("-----contactSave() user findOneAndUpdate------")
            logger.info(JSON.stringify(user, {}, 4))

            if (req.params.mode == "sell") {
                record = await Sells.findOne({ _id: ObjectId(req.params.record) }).lean()
            } else {
                record = await Buys.findOne({ _id: ObjectId(req.params.record) }).lean()
            }
            email = createEmailResponse(req.params.mode, req.params.grade, user.email, user.name, record.information, record._id)
            await sendeMail(email)
            data.prebody = "Your request has been forwarded and we also emailed you a copy!"
            data.sells = await Sells.countDocuments({ _user: user._id, active: true })
            data.buys = await Buys.countDocuments({ _user: user._id, active: true })
            let rootTag = loadTemplate("./src/app_api/menus/landing.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyDataCenter() Error------")
            console.log(error)
        }
    }
}

const contactAdminLogin = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----contactAdminLogin() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./src/app_api/forms/contactAdminLogin.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----contactAdminLogin() Error------")
            console.log(error)
        }
    }
}

const contactAdminsList = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----contactAdminsList() data------")
            logger.info(JSON.stringify(data, {}, 4))
            data = await Admins.find()
            data.master = req.master
            let rootTag = loadTemplate("./src/app_api/forms/contactAdminsList.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----contactAdminsList() Error------")
            console.log(error)
        }
    }
}

const contactAdminShow = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----contactAdminShow() data------")
            logger.info(JSON.stringify(data, {}, 4))
            data = await Admins.findOne({_id:ObjectId(req.params.id)})
            data.master = req.master
            let rootTag = loadTemplate("./src/app_api/forms/contactAdminShow.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----contactAdminShow() Error------")
            console.log(error)
        }
    }
}

const contactAdminSave = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        let admin = {}
        let query = {}
        let update = {}
        let options = { new: true, upsert: true}
        let access = []
        try {
            user = await Users.findOne({ONEmUserId: req.user}).lean()
            if (req.master){
                logger.info("-----contactAdminSave() data------")
                logger.info(JSON.stringify(data, {}, 4))
                query = {name:req.body.name,password:req.body.password}
                update = { admin: req.body.admin }
                admin = await Admins.findOneAndUpdate(query,update,options)
                data.preBody = "Updated "+req.body.name+" to "+req.body.admin+" priviledges"
            } else {
                admin = await Admins.findOne({name:req.body.name,password:req.body.password})
                if (!admin) {
                    data.preBody = "Name or password was incorrect!"
                } else {
                    if (admin.admin != "no"){
                        data.preBody = "You now have "+admin.admin+" priviledges!"
                    } else {
                        data.preBody = "You are logged in!"
                    }
                    query = {name:req.body.name,password:req.body.password}
                    access = admin.access
                    access.push(Date.now())
                    update = { _user: ObjectId(user._id), access:access}
                }
            }
            data.sells = await Sells.countDocuments({ _user: user._id, active: true })
            data.buys = await Buys.countDocuments({ _user: user._id, active: true })
            let rootTag = loadTemplate("./src/app_api/menus/landing.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----contactAdminSave() Error------")
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
    contactSave,
    contactAdminLogin,
    contactAdminsList,
    contactAdminShow,
    contactAdminSave
}