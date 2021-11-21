const bodyParser = require("body-parser");
const express = require("express");
const Admin = require("../data/admin");
const AdminUsers = require('../data/users')

function AdminRouter() {
    let router = express()

    router.use(bodyParser.json({ limit: "100mb" }));
    router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

    router.route('/register')
        .post(function (req, res, next) {
            const body = req.body

            Admin.createAdmin(body)
                .then((admin) => AdminRouter.createToken(admin))
                .then((response) => {
                    res.status(200)
                    res.send(response)
                })
                .catch((err) => {
                    res.status(500);
                    console.log(err);
                    res.send(err);
                    next();
                })
        })

    router.route("/allUsers")
        .get(function (req, res, next) {
            Users.findAllUsers(req).then((users) => {
                res.send(users)
                next()
            })
        })
}

module.exports = AdminRouter