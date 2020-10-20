const bdd = require("./bdd").get()
const sgbd = require("./bdd")

module.exports = {
    flush_link: () => {
        console.log("Vérification des liens à supprimer")
        Object.keys(bdd.to_email).forEach(l => {
            let diff = Date.now() - bdd.to_email[l].created_at;
            let h2 = Math.trunc(1000 * 60 * 60 * 2.1);
            if (diff > h2) {
                console.log("> Flush " + l)
                delete(bdd.to_email[l]);
                sgbd.save();
            }
        })
    }
}