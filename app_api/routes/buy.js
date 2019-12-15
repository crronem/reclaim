const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const Messages = require('../models/Model').Messages

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const { titleCase, formatInfo } = require('../routes/utility')

const buyDataCenter = function () {
    return async function (req, res) {
        let data = {}
        try {
            data.buy = {}
            data.values = {}
            data.buy._id = 0
            data.values._1 = null
            data.values._2 = null
            data.values._3 = null
            logger.info("-----buyDataCenter() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyDataCenter.pug", data) // -> buyGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyDataCenter() Error------")
            console.log(error)
        }
    }
}

const buyCommercial = function () {
    return async function (req, res) {
        let data = {}
        try {
            data.buy = {}
            data.values = {}
            data.buy._id = 0
            data.values._1 = null
            data.values._2 = null
            data.values._3 = null
            logger.info("-----buyCommercial() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyCommercial.pug", data) // -> buyGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyCommercial() Error------")
            console.log(error)
        }
    }
}

const buyPersonal = function () {
    return async function (req, res) {
        let data = {}
        try {
            data.buy = {}
            data.values = {}
            data.buy._id = 0
            data.values._1 = null
            data.values._2 = null
            data.values._3 = null
            logger.info("-----buyPersonal() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyPersonal.pug", data) // -> buyGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyPersonal() Error------")
            console.log(error)
        }
    }
}

const buyHistory = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        try {
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            data.buys = await Buys.aggregate(
                [
                    {
                        $lookup: {
                            from: "messages",
                            localField: "_id",
                            foreignField: "_buy",
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
            for (var i = 0; i < data.buys.length; i++) {
                logger.info("-----buyHistory() data------")
                logger.info(JSON.stringify(data.buys[i], {}, 4))
                if (data.buys[i].enquiry.length > 0) {
                    data.buys[i].title = titleCase(data.buys[i].grade) + moment(data.buys[i].createdAt).format('MMM DD YYYY HH:mm') + " Messages("+data.buys[i].enquiry.length+")"
                } else {
                    data.buys[i].title = titleCase(data.buys[i].grade) + moment(data.buys[i].createdAt).format('MMM DD YYYY HH:mm')
                }
            }
            //data.createdAt = moment(data.createdAt).format('LLLL')
            logger.info("-----buyHistory() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/buyHistory.pug", data) // -> buyHistory
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----bHistory(uy) Error------")
            console.log(error)
        }
    }
}

const buyShow = function () {
    return async function (req, res) {
        let data = {}
        let infoData = []
        try {
            data.buy = await Buys.findOne({_id: ObjectId(req.params.id)})
            data.messages = await Messages.findOne({_buy: ObjectId(data.buy._id)})
            infoData = formatInfo(data.buy.information)
            data.buy.information = infoData[0]
            data.values = infoData[1]
            logger.info("-----buyShow() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/buyShow.pug", data) // -> buyShow
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyShow() Error------")
            console.log(error)
        }
    }
}

const buyRevise = function () {
    return async function (req, res) {
        let data = {}
        let infoData = []
        let rootTag = {}
        try {
            data.master = req.master
            data.buy = await Buys.findOne({_id: ObjectId(req.params.id)})
            data.messages = await Messages.findOne({_buy: ObjectId(data.buy._id)})
            infoData = formatInfo(data.buy.information)
            data.buy.information = infoData[0]
            data.values = infoData[1]
            logger.info("-----buyRevise() data------")
            logger.info(JSON.stringify(data, {}, 4))
            if (data.buy.grade == "dataCenter") {
                rootTag = loadTemplate("./app_api/forms/formBuyDataCenter.pug", data) // -> buyRevise
            } else if (data.buy.grade == "commercial") {
                rootTag = loadTemplate("./app_api/forms/formBuyCommercial.pug", data) // -> buyRevise
            } else {
                rootTag = loadTemplate("./app_api/forms/formBuyPersonal.pug", data) // -> buyRevise
            }
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyRevise() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    buyDataCenter,
    buyCommercial,
    buyPersonal,
    buyHistory,
    buyShow,
    buyRevise
}