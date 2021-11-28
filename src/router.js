const express = require("express");
let UsersAPI = require("./server/auth");
let BedroomAPI = require("./server/bedrooms");

function initialize() {
  let api = express();

  api.use("/auth", UsersAPI());
  api.use("/bedrooms", BedroomAPI());

  return api;
}

module.exports = {
  initialize: initialize,
};
