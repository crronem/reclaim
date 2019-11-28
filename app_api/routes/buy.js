const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const buyDataCenter = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----buyDataCenter() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyDataCenter.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyDataCenter() Error------")
            console.log(error)
        }
    }
}

// const buyDataCenterDetails = function () {
//     return async function (req, res) {
//         let data = {}
//         try {
//             logger.info("-----buyDataCenterDetails() data------")
//             logger.info(JSON.stringify(data, {}, 4))
//             let rootTag = loadTemplate("./app_api/forms/formBuyDataCenter.pug", data) // -> sellGrade
//             let response = Response.fromTag(rootTag)
//             return res.json(response.toJSON())
//         } catch (error) {
//             logger.info("-----buyDataCenterDetails() Error------")
//             console.log(error)
//         }
//     }
// }


const buyCommercial = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----buyCommercial() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyCommercial.pug", data) // -> sellGrade
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
            logger.info("-----buyPersonal() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/forms/formBuyPersonal.pug", data) // -> sellGrade
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyPersonal() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    buyDataCenter,
    //buyDataCenterDetails,
    buyCommercial,
    buyPersonal,
}