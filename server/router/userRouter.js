const express = require("express");
const router = express.Router();
const { userSignUp, userSignIn, validateToken} = require("../control/user.js");
const { authorization } = require("../authorization.js");

router.route("/signUp")
.post(async (req, res) =>{
    userSignUp(req, res);
});

router.route("/signIn")
.post(async (req, res) =>{
    userSignIn(req, res);
});

router.route("/validateToken")
.get( authorization, (req, res) => {
    validateToken(req, res);
});

module.exports = router;