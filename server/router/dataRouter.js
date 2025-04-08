const express = require("express");
const router = express.Router();
const {getConnections, getAllUsers, getConnectionRequests, storeMessage, getMessages} = require("../control/dataControl");
const { authorization } = require("../authorization");

router.route("/connections")
.get(authorization, (req, res) => {
    getConnections(req, res);
});

router.route("/allUsers")
.get(authorization, (req, res) => {
    getAllUsers(req, res);
});

router.route("/store-message")
.post(authorization, (req, res) => {
    storeMessage(req, res);
});

router.route("/conversation/:conversationId")
.get(authorization, (req, res) => {
    getMessages(req, res);
});

module.exports = router;