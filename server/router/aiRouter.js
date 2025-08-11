const express = require("express");
const router = express.Router();
const {authorization} = require("../authorization.js");
const {generateMessage} = require("../control/ai.js");

router.route("/generate-message")
.post(authorization, (req, res) => {
    generateMessage(req, res);
});

module.exports = router;