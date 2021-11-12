const express = require('express')
let AuthAPI = require('./server/auth')
let BedroomAPI = require('./server/bedrooms')

function initialize() {
    let api = express()

    api.use('/auth', AuthAPI())
    api.use('/bedrooms', BedroomAPI())

    return api
}

module.exports = {
    initialize: initialize
}