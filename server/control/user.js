const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.userSignUp = async (req, res) =>{
    const userData = req.body.values;
    try{
        let existingUser = await User.findOne({email: userData.email});
        if(existingUser != null){
            console.log(existingUser);
            return res.status(400).json({message: "Email is already Registered!."});
        }

        let hashedPassword = await bcrypt.hash(userData.password, 10);
        let user = new User({
            userName: userData.userName,
            dob: userData.dob,
            email: userData.email,
            password: hashedPassword,
        });
        console.log(user);
        await user.save();
        
        let token = jwt.sign(user.toObject(), process.env.SECRET_KEY, {expiresIn: "1h"});
        return res.status(201).json({message: "SignUp Successful", token: token});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    };  
}

module.exports.userSignIn = async (req, res) =>{
    try{
        const user = User.findOne({email: req.body.email}, "_id userName email password").lean();
        if (!user) {
            return res.status(404).json("User Not Found!");
        } 

        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isPassword) {
            return res.status(404).json("Incorrect Password");  
        } 

        let token = jwt.sign(user, process.env.SECRET_KEY, 10);
        return res.status(201).json({message: "SignIn Successful", token: token});

    } catch(err){
        console.log(err);
    } 
}

module.exports.validateSession = (req, res) =>{
    let token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(404).json({message: "invalid header"});
    }

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return res.status(201).json({message: "token valid"});

    } catch(err) {
        return res.status(404).json({message: "token invalid"});
    }
}