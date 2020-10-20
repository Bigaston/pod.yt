const path = require("path")
const fs = require("fs");
const bcrypt = require("bcrypt")
const bdd = require("./bdd").get();
const sgbd = require("./bdd")
const mustache = require("mustache");
const email = require("./email")

module.exports = {
    login_form: (req, res) => {
	    res.sendFile(path.join(__dirname, "../web/admin/login.html"))
    },
    admin_post: (req, res) => {
        if (!!req.body.username && !!req.body.password) {
            bcrypt.compare(req.body.password, process.env.ADMIN_PASS, function(err, result) {
                if (result && req.body.username == process.env.ADMIN_USERNAME) {
                    req.session.logged = "oui";
                    res.redirect("/~a/dashboard")
                } else {
                    res.redirect("/~login")
                }
            });
        } else {
            res.redirect("/~login")
        }
    },
    is_logged: (req, res, next) => {
        if (req.session.logged != undefined) {
            next();
        } else {
            res.redirect("/~login")
        }
    },
    is_logged_request: (req, res, next) => {
        if (req.session.logged != undefined) {
            next();
        } else {
            res.status(403).send("NOT LOGGED")
        }
    },
    dashboard: (req, res) => {
        let template = fs.readFileSync(path.join(__dirname, "../web/admin/dashboard.mustache"), "utf-8");
        
        let renderObj = {
            links: []
        }

        let keys = Object.keys(bdd.to_moderation);
        keys.forEach((l) => {
            let obj = {
                code: l,
                to: bdd.to_moderation[l].to
            }

            renderObj.links.push(obj);
        })

        res.setHeader("content-type", "text/html");
        res.send(mustache.render(template, renderObj))
    },
    dashboard_all: (req, res) => {
        let template = fs.readFileSync(path.join(__dirname, "../web/admin/all_link.mustache"), "utf-8");
        
        let renderObj = {
            links: []
        }

        let keys = Object.keys(bdd.link);
        keys.forEach((l) => {
            let obj = {
                code: l,
                to: bdd.link[l].to
            }

            renderObj.links.push(obj);
        })

        res.setHeader("content-type", "text/html");
        res.send(mustache.render(template, renderObj))
    },
    accept: (req, res) => {
        email.send_ok(bdd.to_moderation[req.params.code].email, req.params.code, bdd.to_moderation[req.params.code].to)
        console.log("Lien accepté " + req.params.code);
        bdd.link[req.params.code] = bdd.to_moderation[req.params.code];
        delete(bdd.to_moderation[req.params.code]);
        sgbd.save();
        res.send("OK");
    },
    reject: (req, res) => {
        email.send_nope(bdd.to_moderation[req.params.code].email, req.params.code, bdd.to_moderation[req.params.code].to)
        console.log("Lien refusé " + req.params.code);
        delete(bdd.to_moderation[req.params.code]);
        sgbd.save();
        res.send("OK");
    }
}