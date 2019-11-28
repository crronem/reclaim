const logger = require('debug-level')('reclaim')

const ObjectId = require('mongoose').Types.ObjectId
const moment = require("moment")

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const contactInfo = function () {
    return async function (req, res) {
        let data = {}
        let record = {}
        let addSells = {}
        let addBuys = {}
        try {
            data.mode = req.params.mode 
            data.grade = req.params.grade
            logger.info("-----buyDataCenter() data------")
            logger.info(JSON.stringify(data, {}, 4))
            if (req.params.mode == "sell") {
                if (req.params.grade == "dataCenter") {
                    addSells = new Sells({
                        grade: "dataCenter",
                        server: req.body.servers,
                        networking:req.body.networking,
                        firewall:req.body.firewalls,
                        location:req.body.location,
                        inspection:req.body.inspection,
                        pickup:req.body.pickup
                    })
                } else if (req.params.grade == "commercial") {
                    addSells = new Sells({
                        grade: "commercial",
                        epos: req.body.epos,
                        ticket:req.body.ticket,
                        scanner:req.body.scanner,
                        location:req.body.location,
                        inspection:req.body.inspection,
                        pickup:req.body.pickup
                    })
                } else if (req.params.grade == "personal") {
                    addSells = new Sells({
                        grade: "dataCenter",
                        laptop: req.body.laptops,
                        desktop:req.body.desktops,
                        printer:req.body.printers,
                        storage:req.body.storage,
                        location:req.body.location,
                        inspection:req.body.inspection,
                        pickup:req.body.pickup
                    })
                }
                record = await addSells.save()
            } else { // buy
                if (req.params.grade == "dataCenter") {
                    addBuys = new Buys({
                        grade: "dataCenter",
                        description: req.body.description,
                    })
                } else if (req.params.grade == "commercial") {
                    addBuys = new Buys({
                        grade: "commercial",
                        description: req.body.description,
                    })
                } else if (req.params.grade == "personal") {
                    addBuys = new Buys({
                        grade: "personal",
                        description: req.body.description,
                    })
                }
                record = await addSells.save()   
            }
            data.record = record._id
            let rootTag = loadTemplate("./app_api/forms/formContactInfo.pug", data) // -> contactInfo
            let response = Response.fromTag(rootTag)
            return res.json(response.toJSON())
        } catch (error) {
            logger.info("-----buyDataCenter() Error------")
            console.log(error)
        }
    }
}

const contactSave = function () {
    return async function (req, res) {
        let data = {}
        try {
            logger.info("-----contactSave() data------")
            logger.info(JSON.stringify(data, {}, 4))
            data.prebody = "Your request has been forwarded!"
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