const path = require("path")
const axios = require("axios");
const parse = require('node-html-parser').parse;
const bdd = require("./bdd").get();
const sgbd = require("./bdd")
const email = require("./email")

let yt_regex = new RegExp(/(https:\/\/www\.youtube\.com\/channel\/[A-Za-z0-9]+)|(https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9]+)/);
let link_regex = new RegExp(/[A-Za-z][A-Za-z0-9]{1,24}/);
let email_regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)

module.exports = {
    index: (req, res) => {
	    res.sendFile(path.join(__dirname, "../web/index.html"))
    },
    ok: (req, res) => {
	    res.sendFile(path.join(__dirname, "../web/ok.html"))
    },
    add_link: (req, res) => {
        // Vérification des paramètres
        if (!!req.body.yt_addr && !!req.body.link && !!req.body.email && yt_regex.test(req.body.yt_addr) && link_regex.test(req.body.link) && email_regex.test(req.body.email)) {
            axios({
                url: req.body.yt_addr,
                method: "GET"
            }).then(response => {
                if (parse(response.data).querySelector(".oops-content") == null) {
                    if (sgbd.check_link_valid(req.body.link)) {
                        bdd.to_email[req.body.link] = {
                            to: req.body.yt_addr,
                            email: req.body.email,
                            created_at: Date.now()
                        }

                        sgbd.save();

                        email.send_check(req.body.email, req.body.link, req.body.yt_addr)

                        res.redirect("/~ok")
                    } else {
                        res.redirect("/#link_already_used");
                    }
                } else {
                    res.redirect("/#not_good_playlist");
                }
            }).catch(err => {
                console.log(err)
                res.redirect("/#not_good_channel");
            })
        } else {
            res.redirect("/#not_good_format");
        }
    }
}