const path = require("path")
const axios = require("axios");
const parse = require('node-html-parser').parse;
const bdd = require("./bdd").get();
const sgbd = require("./bdd")
const email = require("./email")
const jwt = require("jsonwebtoken")
const fs = require("fs");
const mustache = require("mustache");

let yt_regex = new RegExp(/(https:\/\/www\.youtube\.com\/channel\/[A-Za-z0-9]+)|(https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9]+)/);
let code_regex = new RegExp(/[A-Za-z][A-Za-z0-9]{1,24}/);
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
        if (!!req.body.yt_addr && !!req.body.code && !!req.body.email && yt_regex.test(req.body.yt_addr) && code_regex.test(req.body.code) && email_regex.test(req.body.email)) {
            axios({
                url: req.body.yt_addr,
                method: "GET"
            }).then(response => {
                if (parse(response.data).querySelector(".oops-content") == null) {
                    if (sgbd.check_code_valid(req.body.code)) {
                        bdd.to_email[req.body.code] = {
                            to: req.body.yt_addr,
                            email: req.body.email,
                            created_at: Date.now()
                        }

                        sgbd.save();

                        let jwt_verif = jwt.sign({
                            code: req.body.code
                        }, process.env.JWT_SECRET, {
                            expiresIn: "2h"
                        })

                        email.send_check(req.body.email, req.body.code, req.body.yt_addr, jwt_verif)

                        res.redirect("/~ok")
                    } else {
                        res.redirect("/#code_already_used");
                    }
                } else {
                    res.redirect("/#not_good_playlist");
                }
            }).catch(err => {
                res.redirect("/#not_good_channel");
            })
        } else {
            res.redirect("/#not_good_format");
        }
    },
    verif_email: (req, res) => {
        jwt.verify(req.params.jwt, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                let template = fs.readFileSync(path.join(__dirname, "../web/basic_page.mustache"), "utf-8");

                renderObj = {
                    body: "<p>Il semblerait que le lien que vous venez d'utiliser n'est pas valide. Il se peut que la durée de 2H soit écoulée ou que la demande n'a pas pus aboutir.</p>",
                    title: "Le lien d'activation n'est pas valide!"
                }
                
                res.setHeader("content-type", "text/html");
                res.send(mustache.render(template, renderObj))
            } else {
                if (bdd.to_email[decoded.code] != undefined) {
                    bdd.to_moderation[decoded.code] = bdd.to_email[decoded.code];
                    delete(bdd.to_email[decoded.code]);
                    sgbd.save();

                    let template = fs.readFileSync(path.join(__dirname, "../web/basic_page.mustache"), "utf-8");

                    renderObj = {
                        body: "<p>Votre lien à bien été envoyé à la modération! Vous receverez un email lorsque celui ci sera aprouvé ou refusé. Si cela met trop de temps (plus de quelques jours), n'hésitez pas à envoyer un message à <a href='https://twitter.com/Bigaston'>@Bigaston</a> sur Twitter!</p>",
                        title: "Lien envoyé à la modération!"
                    }
                    
                    res.setHeader("content-type", "text/html");
                    res.send(mustache.render(template, renderObj))
                } else {
                    let template = fs.readFileSync(path.join(__dirname, "../web/basic_page.mustache"), "utf-8");

                    renderObj = {
                        body: "<p>Il semblerait que votre lien ne soit plus dans la phase de validation d'email. Si vous avez déjà cliqué sur ce lien, c'est normal, il est en phase de modération. Sinon, il se peut que vous ayez dépassé le délais de 2H avant la suppression de la demande.</p>",
                        title: "Lien déjà validé ou supprimé"
                    }
                    
                    res.setHeader("content-type", "text/html");
                    res.send(mustache.render(template, renderObj))
                }
            }
        });
    },
    check_code: (req, res) => {
        if (sgbd.check_code_valid(req.params.code)) {
            res.json({return: "OK"})
        } else {
            res.json({return: "NOT OK"})
        }
    },
    not_found: (req, res) => {
	    res.sendFile(path.join(__dirname, "../web/not_found.html"))
    }
}