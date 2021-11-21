const jwt = require("jsonwebtoken")
const config = require("../../config")
const bcrypt = require("bcrypt")

function AdminService(AdminModel) {
    const USERS_PER_PAGE = 20;
    let service = {
        createAdmin,
        findAllUsers,
        createToken,
        findAdmin,
        findById,
        removeById,
        updateUser,
        createBedroom,
        findAll,
        updateBedroom
    }

    function createAdmin(admin) {
        return createPassword(admin).then((hashPassword, err) => {
            if (err) {
                return Promise.reject("Not saved")
            }

            let newAdminWithPassword = {
                ...user,
                password: hashPassword
            }

            let newAdmin = AdminModel(newAdminWithPassword)
            return saveAdmin(newAdmin)
        })
    }

    function saveAdmin(model) {
        return new Promise(function (resolve, reject) {
            model.sabe(function (err) {
                console.log(err)
                if (err) reject("There is a problem with register.")
                resolve("User created!");
            })
        })
    }

    function findAllUsers(req) {
        const { page = 1 } = req.query;
        return new Promise(function (resolve, reject) {
            UserModel.find({}, function (err, users) {
                if (err) reject(err)
                resolve(users)
            })
                .limit(USERS_PER_PAGE)
                .skip((page - 1) * USERS_PER_PAGE)
                .sort([[req.query.orderBy, req.query.direction]]);
        })
    }

    function createToken() {
        let token = jwt.sign({}, config.secret, {
            expiresIn: config.expiresPassword,
        });
        return { auth: true, token };
    }

    function findAdmin({ username, password }) {
        return new Promise(function (resolve, reject) {
            AdminModel.findOne({ username }, function (err, admin) {
                if (err) reject(err)

                if (!username) {
                    reject("This data is wrong.")
                }

                resolve(user)
            })
        })
            .then((admin) => {
                return comparePassword(password, admin.password).then((match) => {
                    if (!match) return Promise.reject("Admin not valid.")
                    return Promise.resolve(admin)
                })
            })
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

    function createPassword(admin) {
        return bcrypt.hash(admin.password, config.saltRounds);
    }

    function comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    function createBedroom(values) {
        let newBedroom = BedroomModel(values);
        return saveBedroom(newBedroom);
    }

    function saveBedroom(newBedroom) {
        return new Promise(function (resolve, reject) {
            newBedroom.save(function (err) {
                if (err) reject(err);
                resolve("Bedroom created!");
            });
        });
    }

    function findAll(req) {
        const { page = 1 } = req.query;
        return new Promise(function (resolve, reject) {
            BedroomModel.find({}, function (err, bedrooms) {
                if (err) reject(err);
                resolve(bedrooms);
            })
                .limit(BEDROOMS_PER_PAGE)
                .skip((page - 1) * BEDROOMS_PER_PAGE)
                .sort([[req.query.orderBy, req.query.direction]]);
        });
    }

    function findById(id) {
        return new Promise(function (resolve, reject) {
            BedroomModel.findById(id, function (err, bedroom) {
                if (err) reject(err);
                resolve(bedroom);
            });
        });
    }

    function removeById(id) {
        return new Promise(function (resolve, reject) {
            console.log(id);
            BedroomModel.findByIdAndRemove(id, function (err) {
                console.log(err);
                if (err) reject(err);
                resolve();
            });
        });
    }

    function updateBedroom(id, values) {
        return new Promise(function (resolve, reject) {
            BedroomModel.findByIdAndUpdate(id, values, function (err, bedroom) {
                if (err) reject(err);
                resolve(bedroom);
            });
        });
    }

    return service
}

module.exports = AdminService