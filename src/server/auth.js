const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const { validate } = require("../data/users/user");
const authorize = require('../middleware/auth')
const Joi = require('joi')
const crypto = require('crypto')
const Token = require('../data/tokens/token')
const sendEmail = require('../utils/sendEmail')
const User = require("../data/users/user")
const bcrypt = require('bcrypt')
const config = require('../config')


function UsersRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route('/resetPassword')
    .post(async function (req, res) {
      try {
        const schema = Joi.object({ email: Joi.string().email().required() })

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email })
        if (!user)
          return res.status(400).send("Utilizador não existe")

        let token = await Token.findOne({ userId: user._id })
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
          }).save()
        }

        const link = `http://localhost:3000/auth/resetPassword/${user._id}/${token.token}`
        await sendEmail(user.email, "Password reset", link)
        res.send("Email enviado com sucesso.")
      } catch (error) {
        res.send("Ocorreu um erro.")
        console.log(error)
      }
    })

  router.route("/resetPassword/:userId/:token")
    .post(async function (req, res) {
      try {
        const schema = Joi.object({ password: Joi.string().required() })
        const { error } = schema.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const user = await User.findById(req.params.userId)
        if (!user) return res.status(400).send("Link invalido ou expirado.")

        const token = await Token.findOne({
          userId: user._id,
          token: req.params.token
        })
        if (!token) return res.status(400).send("Link invalido ou expirado.")
        user.password = await bcrypt.hash(req.body.password, config.saltRounds);
        await user.save()
        await token.delete()

        res.send("Password atualizada com sucesso.")
      } catch (error) {
        res.send("Ocorreu um erro")
        console.log(error)
      }
    })

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
    .get(authorize, function (req, res, next) {
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
          res.send("Token expirado.");
          next();
        });
    });

  router.route("/login")
    .post(function (req, res, next) {
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
    .get(authorize, function (req, res, next) {
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
    .put(authorize, function (req, res, next) {
      let userid = req.params.userid;
      let body = req.body;

      Users.updateUser(userid, body).then((user) => {
        res.status(200);
        res.send(user);
        next();
      });
    })
    .delete(authorize, function (req, res, next) {
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

  router.post('/', async (req, res) => {
    try {
      const { error } = validate(req.body)
      if (error) return res.status(400).send(error.details[0].message)

      const user = await new User(req.body).save()

      res.send(user)
    } catch (error) {
      res.send("Erro qualquer")
      console.log(error)
    }
  })

  router.route('/')
    .post(async function (req, res) {
      try {
        const schema = Joi.object({ email: Joi.string().email().required() })

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email })
        if (!user)
          return res.status(400).send("Utilizador não existe")

        let token = await Token.findOne({ userId: user._id })
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
          }).save()
        }

        const link = `http://localhost:3000/passwordReset/${user._id}/${token.token}`
        await sendEmail(user.email, "Password reset", link)
        res.send("Ocorreu um erro")
        console.log(error)
      } catch (error) {
        res.send("Ocorreu um erro2")
        console.log(error)
      }
    })

  router.post("/:userId/:token", async (req, res) => {
    try {
      const schema = Joi.object({ password: Joi.string().required() })
      const { error } = schema.validate(req.body)
      if (error) return res.status(400).send(error.details[0].message)

      const user = await User.findById(req.params.userId)
      if (!user) return res.status(400).send("Link invalido ou expirado")

      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token
      })
      if (!token) return res.status(400).send("Link invalido ou expirado2")
      user.password = req.body.password
      await user.save()
      await token.delete()

      res.send("password reset com sucesso")
    } catch (error) {
      res.send("Ocorreu um erro")
      console.log(error)
    }
  })



  return router;
}

module.exports = UsersRouter;