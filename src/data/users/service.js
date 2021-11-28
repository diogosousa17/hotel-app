const jwt = require("jsonwebtoken");
const config = require("../../config");
const bcrypt = require("bcrypt");

function UserService(UserModel) {
  //user per page 20
  const USERS_PER_PAGE = 20;
  let service = {
    createUser,
    saveUser,
    createToken,
    verifyToken,
    findUser,
    findById,
    createPassword,
    comparePassword,
    updateUser,
    removeById,
    findAllUsers,
  };

  function createUser(user) {
    return createPassword(user).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Not saved");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };

      let newUser = UserModel(newUserWithPassword);
      return saveUser(newUser);
    });
  }

  function saveUser(model) {
    return new Promise(function (resolve, reject) {
      model.save(function (err) {
        console.log(err);
        if (err) reject("There is a problem with register.");
        resolve("User created!");
      });
    });
  }

  function findAllUsers(req) {
    const { page = 1 } = req.query;
    return new Promise(function (resolve, reject) {
      UserModel.find({}, function (err, users) {
        if (err) reject(err);
        resolve(users);
      })
        //limits users per page and skip when you change page skips 20
        .limit(USERS_PER_PAGE)
        .skip((page - 1) * USERS_PER_PAGE)
        .sort([[req.query.orderBy, req.query.direction]]);
    });
  }

  function createToken(user) {
    let token = jwt.sign(
      { username: user.username, userType: user.userType },
      config.secret,
      {
        expiresIn: config.expiresPassword,
      }
    );
    return { auth: true, token };
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }
        return resolve(decoded);
      });
    });
  }

  function findUser({ username, password }) {
    return new Promise(function (resolve, reject) {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(err);

        if (!username) {
          reject("This data is wrong.");
        }

        resolve(user);
      });
    }).then((user) => {
      return comparePassword(password, user.password).then((match) => {
        if (!match) return Promise.reject("User not valid.");
        return Promise.resolve(user);
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      UserModel.findById(id, function (err, bedroom) {
        if (err) reject(err);
        resolve(bedroom);
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      console.log(id);
      UserModel.findByIdAndRemove(id, function (err) {
        console.log(err);
        if (err) reject(err);
        resolve();
      });
    });
  }

  function updateUser(id, values) {
    return new Promise(function (resolve, reject) {
      UserModel.findByIdAndUpdate(id, values, function (err, user) {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  return service;
}

module.exports = UserService;
