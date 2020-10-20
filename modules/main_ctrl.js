const path = require("path")
const axios = require("axios");
const parse = require('node-html-parser').parse;

let yt_regex = new RegExp(/(https:\/\/www\.youtube\.com\/channel\/[A-Za-z0-9]+)|(https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9]+)/);
let link_regex = new RegExp(/[A-Za-z][A-Za-z0-9]{1,24}/);
let email_regex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)

module.exports = {
    index: (req, res) => {
	    res.sendFile(path.join(__dirname, "../web/index.html"))
    },
    add_link: (req, res) => {
        // Vérification des paramètres
        if (!!req.body.yt_addr && !!req.body.link && !!req.body.email && yt_regex.test(req.body.yt_addr) && link_regex.test(req.body.link) && email_regex.test(req.body.email)) {
            axios({
                url: req.body.yt_addr,
                method: "GET"
            }).then(res => {
                if (parse(res.data).querySelector(".oops-content") == null) {

                } else {
                    res.redirect("/#not_good_playlist")
                }
            }).catch(err => {
                res.redirect("/#not_good_channel");
            })
        }
    }
}