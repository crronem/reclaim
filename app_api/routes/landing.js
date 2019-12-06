const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const Users = require('../models/Model').Users
const Buys = require('../models/Model').Buys
const Sells = require('../models/Model').Sells

const menu = function () {
    return async function (req, res) {
        let data = {}
        let user = {}
        try {
            user = await Users.findOne({ ONEmUserId: req.user }).lean()
            if (!user) {
                user = await Users.findOneAndUpdate({ ONEmUserId: req.user }, { name: "Guest" }, { new: true, upsert: true }).lean()
                data.name = user.name
                data.sells = 0
                data.buys = 0
                data.preBody = ""
            } else {
                data.master = user.master
                data.name = user.name
                data.preBody = "Welcome back " + user.name + "!"
                data.sells = await Sells.count({ _user: user._id, active: true })
                data.buys = await Buys.count({ _user: user._id, active: true })
                if (data.sells > 0 || data.buys > 0) {
                    data.prebody += "\nYou have active buy/sell options."
                    data.prebody += "\nWhat would you like to do?"
                } else {
                    data.preBody += "\nWhat would you like to do?"
                    data.buys = 0
                    data.sells = 0
                }
            }
            logger.info("-----menu() data------")
            logger.info(JSON.stringify(data, {}, 4))
            let rootTag = loadTemplate("./app_api/menus/landing.pug", data)
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----Landing() Error------")
            console.log(error)
        }
    }
}

module.exports = {
    menu
}