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
    },
    send_ok: (email, address, to) => {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        template = fs.readFileSync(path.join(__dirname, "../web/email/email_ok.mustache"), "utf8")
        renderObj = {
            address: process.env.HOST + "/" + address,
            to: to,
        }

        const mailOptions = {
            from: 'Accepté@' + process.env.SMTP_DOMAIN, // sender address
            to: email, // list of receivers
            subject: "Votre lien " + address + " a été accepté!", // Subject line
            html: juice(mustache.render(template, renderObj))
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) return console.log(err)
        });
    },
    send_nope: (email, address, to) => {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        template = fs.readFileSync(path.join(__dirname, "../web/email/email_nope.mustache"), "utf8")
        renderObj = {
            address: process.env.HOST + "/" + address,
            to: to,
        }

        const mailOptions = {
            from: 'Refusé@' + process.env.SMTP_DOMAIN, // sender address
            to: email, // list of receivers
            subject: "Votre lien " + address + " a été refusé...", // Subject line
            html: juice(mustache.render(template, renderObj))
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) return console.log(err)
        });
    },
    send_new_verif: (code, to) => {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        template = fs.readFileSync(path.join(__dirname, "../web/email/email_new.mustache"), "utf8")
        renderObj = {
            code: code,
            to: to,
        }

        const mailOptions = {
            from: 'NouveauCode@' + process.env.SMTP_DOMAIN, // sender address
            to: process.env.ADMIN_EMAIL, // list of receivers
            subject: "Nouveau code : " + code, // Subject line
            html: juice(mustache.render(template, renderObj))
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) return console.log(err)
        });
    }
}