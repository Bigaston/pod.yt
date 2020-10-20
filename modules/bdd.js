const { deepStrictEqual } = require("assert");
const fs = require("fs");
const path = require("path")

let bdd = undefined;

/*
{
    "to": "",
    "email": ""
}
*/

module.exports = {
    get: () => {
        if (bdd != undefined) {
            return bdd;
        } else {
            if (fs.existsSync(path.join(__dirname, "../bdd.json"))) {
                bdd = require(path.join(__dirname, "../bdd.json"));
                return bdd;
            } else {
                bdd = {link: {}, to_moderation: {}, to_email: {}};
                module.exports.save();
                return bdd;
            }
        }
    },
    save: () => {
        fs.writeFileSync(path.join(__dirname, "../bdd.json"), JSON.stringify(bdd, null, 4));
    },
    check_code_valid: (code) => {
        let loc_bdd = module.exports.get();

        return !Object.keys(loc_bdd.link).includes(code) && !Object.keys(loc_bdd.to_moderation).includes(code) && !Object.keys(loc_bdd.to_email).includes(code);
    }
}