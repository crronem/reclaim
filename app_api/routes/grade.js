const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const gradeSelect = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            logger.info("-----sell() data------")
            logger.info(JSON.stringify(data, {}, 4))
            data.mode = req.params.mode
            rootTag = loadTemplate("./app_api/menus/gradeSelect.pug", data) // 
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sell() Error------")
            console.log(error)
        }
    }
}

const grade = function () {
    return async function (req, res) {
        let data = {}
        let rootTag = {}
        try {
            logger.info("-----sell() data------")
            logger.info(JSON.stringify(data, {}, 4))
            logger.info("-----sell() params------")
            logger.info(JSON.stringify(req.params, {}, 4))
            if (req.params.grade == "dataCenter") {
                if (data.mode == "sell") {
                    rootTag = loadTemplate("./app_api/forms/formSellDataCenter.pug", data)
                } else {
                    rootTag = loadTemplate("./app_api/forms/formBuyDataCenter.pug", data)
                } 
            } else if (req.params.grade == "commercial"){
                if (data.mode == "sell") {
                    rootTag = loadTemplate("./app_api/forms/formSellCommercial.pug", data)
                } else {
                    rootTag = loadTemplate("./app_api/forms/formBuyCommercial.pug", data)
                } 
            } else if (req.params.grade == "personal") {
                if (data.mode == "sell") {
                    rootTag = loadTemplate("./app_api/forms/formSellPersonal.pug", data)
                } else {
                    rootTag = loadTemplate("./app_api/forms/formBuyPersonal.pug", data)
                }         
            }
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----sell() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    gradeSelect,
    grade
}