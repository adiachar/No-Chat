const express = require("express");
const router = express.Router();
const {authorization} = require("../authorization.js");
const {requestConnection, acceptConnection, rejectConnection} = require("../control/connectionControl");

router.route("/request-connection")
.post(authorization, (req, res) => {
    requestConnection(req, res);
});

router.route("/accept")
.post(authorization, (req, res) => {
    acceptConnection(req, res);
});

router.route("/reject")
.post(authorization, (req, res) => {
    rejectConnection(req, res);
});

module.exports = router;