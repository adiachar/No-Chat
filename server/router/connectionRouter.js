const express = require("express");
const router = express.Router();
const {connectionRequest, acceptConnection, rejectConnection} = require("../control/connectionControl");

router.route("/")
.post((req, res) => {
    connectionRequest(req, res);
});

router.route("/accept")
.post((req, res) => {
    acceptConnection(req, res);
});

router.route("/reject")
.post((req, res) => {
    rejectConnection(req, res);
});

module.exports = router;