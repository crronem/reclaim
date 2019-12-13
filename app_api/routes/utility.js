const moment = require("moment")
const logger = require('debug-level')('reclaim')

function formatInfo(object) {

    let info = JSON.stringify(object, {}, 4).slice(1,-1).replace(/"/g,"").replace(/_/g," ")
    let line = []
    let values = {}
    let ctr = 0

    logger.info("-----formatInfo------")
    logger.info(JSON.stringify(object, {}, 4))

    info = info.slice(1,-1).split(',\n')

    for (var i=0;i < info.length; i++) {
        line = info[i].split(": ")
        line[0] = line[0].replace(/-/g,",").replace(/ And /g," & ")
        line[0] = line[0].trimLeft()
        
        logger.info("-----formatInfo------")    
        logger.info(JSON.stringify(line[1], {}, 4))
        if (line[0].includes("Inspect") || line[0].includes("Pickup") || line[0].includes("Delivery") ) {

            line[1] = moment(line[1]).format('MMM DD YYYY HH:mm')
            logger.info("-----formatInfo------")
            logger.info(JSON.stringify(line[1], {}, 4))
        }
        info[i] = line[0] + ": "+line[1]
        ctr = i+1
        values["_"+ctr] = line[1]
    }
    info.sort()
    for (var i=0;i < info.length; i++) {
        info[i] = info[i].slice(2)
    }    
    return [info, values]
}

function titleCase(text) {
    let newText = ""
    if (text.length > 0) {
        let words = text.split(" ")
        for (var i = 0; i < words.length; i++) {
            newText += words[i].slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
        }
        return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
    } else {
        return text
    }
}

function stripSpaces(text) {
    return text.replace(/\s\s+/g,' ')
}

function cut(text, len) {
    if (text.length > len - 2) {
        return text.slice(0, len - 2) + ".."
    } else {
        return text
    }
}

function titleSentence(text) {
    if (text.length > 0) {
        let words = text.split(" ")
        for (i = 0; i < words.length; i++) {
            if (words[i].length > 1) {
                words[i] = words[i].slice(0, 1).toUpperCase() + words[i].slice(1).toLowerCase()
            }
        }
        return words.join(" ")
    } else {
        return text
    }
}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/gi, ",");
}

function codeGen(length,type) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if (length > 10) {
        characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    } else if (type == "numeric") {
        characters = "0123456789"
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    titleCase,
    stripSpaces,
    cut,
    titleSentence,
    commas,
    codeGen,
    formatInfo
}