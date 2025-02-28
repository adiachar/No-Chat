const express = require("express");
const router = express.Router();
const {getConnections, getUsers, getConnectionRequests, storeMessage} = require("../control/dataControl");

router.route("/connections")
.get((req, res) => {
    getConnections(req, res);
});

router.route("/allUsers")
.get((req, res) => {
    getUsers(req, res);
});

router.route("/connectionRequests")
.get((req, res) => {
    getConnectionRequests(req, res);
});

router.route("/storeMessage")
.post((req, res) => {
    storeMessage(req, res);
});

module.exports = router;