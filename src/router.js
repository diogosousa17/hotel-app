const express = require('express')
let UsersAPI = require('./server/users')
let BedroomAPI = require('./server/bedrooms')

function initialize() {
    let api = express()

    api.use('/users', UsersAPI())
    api.use('/bedrooms', BedroomAPI())

    return api
}

module.exports = {
    initialize: initialize
}