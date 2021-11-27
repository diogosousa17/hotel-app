const express = require('express')
let UsersAPI = require('./server/auth')
let BedroomAPI = require('./server/bedrooms')
let PasswordReset = require('./server/passwordReset')

function initialize() {
    let api = express()

    api.use('/auth', UsersAPI())
    api.use('/bedrooms', BedroomAPI())
    // api.use('/passwordReset', PasswordReset)

    return api
}

module.exports = {
    initialize: initialize
}