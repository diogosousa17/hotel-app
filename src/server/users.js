const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");

function UsersRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register")
    .post(function (req, res, next) {
      const body = req.body;

      Users.createUser(body)
        .then((user) => Users.createToken(user))
        .then((response) => {
          res.status(200);
          res.send(response);
        })
        .catch((err) => {
          res.status(500);
          console.log(err);
          res.send(err);
          next();
        });
    });

  router.route("/allUsers")
    .get(function (req, res, next) {
      Users.findAllUsers(req).then((users) => {
        res.send(users)
        next()
      })
    })

  router.route("/me")
    .get(function (req, res, next) {
      let token = req.headers["x-access-token"];

      if (!token) {
        return res
          .status(401)
          .send({ auth: false, message: "No token provided" });
      }

      return Users.verifyToken(token)
        .then((decoded) => {
          res.status(202).send({ auth: true, decoded });
        })
        .catch((err) => {
          res.status(500);
          res.send(err);
          next();
        });
    });

  router.route("/login").post(function (req, res, next) {
    const body = req.body;

    Users.findUser(body)
      .then((user) => Users.createToken(user))
      .then((response) => {
        res.status(202);
        res.send(response);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        next();
      });
  });

  router
    .route("/user/:userid")
    .get(function (req, res, next) {
      let userid = req.params.userid;

      Users.findById(userid)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(function (req, res, next) {
      let userid = req.params.userid;
      let body = req.body;

      Users.updateUser(userid, body).then((user) => {
        res.status(200);
        res.send(user);
        next();
      });
    })
    .delete(function (req, res, next) {
      let userid = req.params.userid;
      Users.removeById(userid)
        .then(() => {
          res.status(200).json();
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  return router;
}

module.exports = UsersRouter;