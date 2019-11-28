const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

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



module.exports = {
    sellDataCenter,
    sellCommercial,
    sellPersonal
}