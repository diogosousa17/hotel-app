const bodyParser = require("body-parser");
const express = require("express");
const Bedrooms = require("../data/bedrooms");
const authorize = require('../middleware/auth')

function BedroomRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/add")
    .post(authorize, function (req, res, next) {
      let body = req.body;
      Bedrooms.createBedroom(body)
        .then(() => {
          res.status(200);
          res.send(body);
          next();
        })
        .catch((err) => {
          err.status = err.status || 500;
          res.status(401);
          next();
        });
    });

  router.route("/bedroom")
  .get(function (req, res, next) {
      Bedrooms.findAll(req).then((bedrooms) => {
        res.send(bedrooms);
        next();
      });
    });

  router.route("/bedroom/:bedroomId")
    .get(function (req, res, next) {
      let bedroomId = req.params.bedroomId;

      Bedrooms.findById(bedroomId)
        .then((bedroom) => {
          res.status(200);
          res.send(bedroom);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(authorize, function (req, res, next) {
      let bedroomId = req.params.bedroomId;
      let body = req.body;

      Bedrooms.updateBedroom(bedroomId, body).then((bedroom) => {
        res.status(200);
        res.send(bedroom);
        next();
      });
    })
    .delete(authorize, function (req, res, next) {
      let bedroomId = req.params.bedroomId;
      Bedrooms.removeById(bedroomId)
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

module.exports = BedroomRouter;
