const bcrypt = require("bcryptjs");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Conversation = require("../model/conversation.js");
const {onlineUsers} = require("../onlineUsers.js");

dotenv.config();

const isUsersOnline = async (user_id, connections) => {
    for(let connection of connections){
        connection.isOnline = onlineUsers.has(connection._id.toString());
        let con_id = [user_id, connection._id].sort().join("_");
        let conversation = await Conversation.find({con_id: con_id}, "lastMessage");
        connection.msg = conversation[0] ? conversation[0].lastMessage : "Say hii to your new Friend!";
    }

    return [...connections];
}

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
    
        let token = jwt.sign({user_id: user._id}, process.env.SECRET, {expiresIn: "1h"});
        return res.status(200).json({message: "SignUp Successful", token: token, user: user});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    };  
}

module.exports.userSignIn = async (req, res) =>{
    try{
        const user = await User.findOne({email: req.body.email})
        .populate("connections", "_id userName email")
        .populate("connectionRequests", "_id userName email").lean();

        if(!user) {
            return res.status(404).json({message: "User Not Found!"});
        } 
        
        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if(!isPassword) {
            return res.status(404).json({message: "Incorrect Password"});  
        }

        user.connections = await isUsersOnline(req.user_id, user.connections);

        delete user.password;

        let token = jwt.sign({user_id: user._id}, process.env.SECRET);

        return res.status(200).json({message: "SignIn Successful", token: token, user: user});

    } catch(err) {
        console.log(err);
        return res.status(404).json({message: "Internal Server Error"});
    } 
}

module.exports.validateToken = async (req, res) => {
    if(req.user_id && req.token) {
        try{
            const user = await User.findById({_id: req.user_id}, "_id userName email connections connectionRequests")
            .populate("connections", "_id userName email")
            .populate("connectionRequests", "_id userName email").lean();

            if (!user) {
                return res.status(404).json("User Not Found!");
            } 

            user.connections = await isUsersOnline(req.user_id, user.connections);

            return res.status(200).json({message: "SignIn Successful", token: req.token, user: user});
    
        } catch(err) {
            console.log(err);
            return res.status(404).json({message: "Internal Server Error"});
        } 
    }

    return res.status(404).json({message: "Invalid Tokin!"});
}