const mailjet = require('node-mailjet').connect('61821d448bfd0bc47e4e057e4e403c7d', '630072064a39f5eabdf44b8afda68ebf')

const sendeMail = async function (email) {
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": email.fromEmail,
                        "Name": email.fromName
                    },
                    "To": [
                        {
                            "Email": email.toEmail,
                            "Name": email.toName
                        }
                    ],
                    "Subject": email.subject,
                    "TextPart": email.message,
                    "HTMLPart": "",
                    "CustomID": email.id 
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
}

module.exports = {
    sendeMail,
}