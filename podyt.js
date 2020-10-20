require("dotenv").config();

const express = require('express')
const m = require("./modules")
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require("bcrypt");

var app = express()

app.use(bodyParser.urlencoded({ extended: true })) 
app.use(bodyParser.json());
app.use("/public", express.static('./web/public'));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.get("/", m.main_ctrl.index);
app.post("/~add_link", m.main_ctrl.add_link);
app.get("/~ok", m.main_ctrl.ok);
app.get("/~verif/:jwt", m.main_ctrl.verif_email);
app.get("/~check_code/:code", m.main_ctrl.check_code);

// ADMINISTRATION
app.get("/~login", m.admin_ctrl.login_form);
app.post("/~login", m.admin_ctrl.admin_post);
app.get("/~a/dashboard", m.admin_ctrl.is_logged, m.admin_ctrl.dashboard);
app.get("/~a/accept/:code", m.admin_ctrl.is_logged_request, m.admin_ctrl.accept);
app.get("/~a/reject/:code/:raison", m.admin_ctrl.is_logged_request, m.admin_ctrl.reject);

app.listen(process.env.PORT, () => console.log(`Serveur lancé sur ${process.env.PORT}`))