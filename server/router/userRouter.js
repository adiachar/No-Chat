const express = require("express");
const router = express.Router();
const { userSignUp, userSignIn, validateSession} = require("../control/user.js");
// const upload = require("../multerConfig.js"); //cloudinary profile pic storage is not working.

router.route("/signUp")
.post(async (req, res) =>{
    await userSignUp(req, res);
});

router.route("/signIn")
.post(async (req, res) =>{
    await userSignIn(req, res);
});

router.route("/validateSession")
.get((req, res) => {
    validateSession(req, res)
});

module.exports = router;