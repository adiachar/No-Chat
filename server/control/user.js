const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.userSignUp = async (req, res) =>{
    const userData = req.body;
    
    try{
        let existingUser = await User.findOne({email: userData.email});
        if(existingUser != null){
            return res.status(400).json({message: "Email is already Registered!."});
        }

        let hashedPassword = await bcrypt.hash(userData.password, 10);
        
        let user = new User({
            userName: userData.userName,
            dob: userData.dob,
            email: userData.email,
            password: hashedPassword,
        });

        await user.save();

        delete user.password;
    
        let token = jwt.sign(user.toObject(), process.env.SECRET, {expiresIn: "1h"});
        return res.status(200).json({message: "SignUp Successful", token: token, user: user});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    };  
}

module.exports.userSignIn = async (req, res) =>{
    
    try{
        const user = await User.findOne({email: req.body.email}).lean();
        if (!user) {
            return res.status(404).json("User Not Found!");
        } 

        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isPassword) {
            return res.status(404).json({message: "Incorrect Password"});  
        } 

        delete user.password;

        let token = jwt.sign(user, process.env.SECRET);

        return res.status(200).json({message: "SignIn Successful", token: token, user: user});

    } catch(err) {
        console.log(err);
        return res.status(404).json({message: "Internal Server Error"});
    } 
}