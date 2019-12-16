const mailjet = require('node-mailjet').connect('7ccc8372033c8afb393625f16e358053', 'da1984411dc0ab9aab72d72a88f0f4cc')

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
                        },{
                            "Email": "chrishornuk@gmail.com",
                            "Name": "Chris Horn To",
                        }
                    ],
                    "Bcc": [
                        {
                            "Email": "chris@onem.com",
                            "Name": "Chris Richardson"
                        },{
                            "Email": "chris.horn@onem.com",
                            "Name": "Chris Horn Bcc",
                        }
                    ],
                    "Subject": email.subject,
                    "TextPart": email.message,
                    "HTMLPart": "", // "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                    "CustomID": email.id //"AppGettingStartedTest"
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