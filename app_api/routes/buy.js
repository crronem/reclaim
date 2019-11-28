const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const buyDataCenter = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellDataCenter() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/formBuyDataCenter.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellDataCenter() Error------")
            console.log(error)
        }
    }
}


const buyCommercial = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellCommercial() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/formSellCommercial.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellCommercial() Error------")
            console.log(error)
        }
    }
}

const buyPersonal = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----sellPersonal() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/formSellPersonal.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sellPersonal() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    buyDataCenter,
    buyCommercial,
    buyPersonal,
}