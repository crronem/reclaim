const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const Users = require('../models/Model').Users
const Sells = require('../models/Model').Sells
const Messages = require('../models/Model').Messages

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const { titleCase, formatInfo } = require('../routes/utility')

const sellDataCenter = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellDataCenter() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formSellDataCenter.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellDataCenter() Error------")
            console.log(error)
        }
    }
}

const sellCommercial = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellCommercial() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formSellCommercial.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellCommercial() Error------")
            console.log(error)
        }
    }
}

const sellPersonal = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellPersonal() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formSellPersonal.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellPersonal() Error------")
            console.log(error)
        }
    }
}

const sellHistory = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        try {
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            data.sells = await Sells.aggregate(
                [
                    {
                        $lookup: {
                            from: "messages",
                            localField: "_id",
                            foreignField: "_sell",
                            as: "enquiry"
                        }
                    }, {
                        $match: {
                            _user: ObjectId(user._id),
                            active: true
                        }
                    }
                ]
            )
            for (var i = 0; i < data.sells.length; i++) {
                logger.info("-----sellHistory() for ------")
                logger.info(JSON.stringify(data.sells[i], {}, 4))
                if (data.sells[i].enquiry.length > 0) {
                    data.sells[i].title = titleCase(data.sells[i].grade) + " " + moment(data.sells[i].createdAt).format('MMM DD YYYY HH:mm') + " Messages("+data.sells[i].enquiry.length+")"
                } else {
                    data.sells[i].title = titleCase(data.sells[i].grade) + " " + moment(data.sells[i].createdAt).format('MMM DD YYYY HH:mm')
                }
            }
            //data.createdAt = moment(data.createdAt).format('LLLL')
            logger.info("-----sellHistory() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/sellHistory.pug", data) // -> sellHistory
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellHistory() Error------")
            console.log(error)
        }
    }
}

const sellShow = function () {
    return async function (req, res) {
        let data = {}
        try {
            data.sell = await Sells.findOne({_id: ObjectId(req.params.id)})
            data.messages = await Messages.findOne({_sell: ObjectId(data.sell._id)})
            data.sell.information = formatInfo(data.sell.information)
            logger.info("-----sellShow() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/sellShow.pug", data) // -> sellShow
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellShow() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    sellDataCenter,
    sellCommercial,
    sellPersonal,
    sellHistory,
    sellShow
}