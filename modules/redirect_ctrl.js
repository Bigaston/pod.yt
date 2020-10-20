const bdd = require("./bdd").get();

module.exports = {
    redirect: (req, res) => {
        if (bdd.link[req.params.code] != undefined) {
            res.redirect(bdd.link[req.params.code].to);
        } else {
            res.redirect("/~404");
        }
    }
}