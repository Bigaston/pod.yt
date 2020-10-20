const nodemailer = require("nodemailer");
const juice = require("juice");
const mustache = require("mustache");
const fs = require("fs");
const path = require("path")

module.exports = {
    send_check: (email, address, to, jwt_verif) => {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        template = fs.readFileSync(path.join(__dirname, "../web/email/email_check.mustache"), "utf8")
        renderObj = {
            address: process.env.HOST + "/" + address,
            to: to,
            jwt_link: process.env.HOST + "/~verif/" + jwt_verif
        }

        const mailOptions = {
            from: 'Validation@' + process.env.SMTP_DOMAIN, // sender address
            to: email, // list of receivers
            subject: "Validation de votre lien " + address, // Subject line
            html: juice(mustache.render(template, renderObj))
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) return console.log(err)
        });
    }
}