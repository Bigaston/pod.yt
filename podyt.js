require("dotenv").config();

const express = require('express')
const m = require("./modules")
const bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: true })) 
app.use(bodyParser.json());
app.use("/public", express.static('./web/public'));

app.get("/", m.main_ctrl.index);
app.post("/~add_link", m.main_ctrl.add_link)


app.listen(process.env.PORT, () => console.log(`Serveur lancé sur ${process.env.PORT}`))