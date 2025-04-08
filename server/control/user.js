const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Conversation = require("../model/conversation.js");
const onlineUsers = require("../onlineUsers.js");

dotenv.config();

const isUsersOnline = async (connections) => {
    for(let connection of connections){
        connection.isOnline = onlineUsers.has(connection._id.toString());
        let con_id = [req.user_id, connection._id].sort().join("_");
        let conversation = await Conversation.find({con_id: con_id}, "lastMessage");
        connection.msg = conversation[0] ? conversation[0].lastMessage : "---";
        console.log(connection);
    }

    return connections;
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
    
        let token = jwt.sign(user.toObject(), process.env.SECRET, {expiresIn: "1h"});
        return res.status(200).json({message: "SignUp Successful", token: token, user: user});

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    };  
}

module.exports.userSignIn = async (req, res) =>{
    
    try{
        const user = await User.findOne({email: req.body.email}, "_id userName email connections connectionRequests")
        .populate("connections", "_id userName email")
        .populate("connectionRequests", "_id userName email").lean();

        if (!user) {
            return res.status(404).json("User Not Found!");
        } 
        
        const isPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isPassword) {
            return res.status(404).json({message: "Incorrect Password"});  
        }

        user.connections = await isUsersOnline(user.connections);

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
            const user = await User.findById(req.user_id, "_id userName email connections connectionRequests")
            .populate("connections", "_id userName email")
            .populate("connectionRequests", "_id userName email").lean();

            if (!user) {
                return res.status(404).json("User Not Found!");
            } 

            user.connections = await isUsersOnline(user.connections);

            return res.status(200).json({message: "SignIn Successful", token: req.token, user: user});
    
        } catch(err) {
            console.log(err);
            return res.status(404).json({message: "Internal Server Error"});
        } 
    }

    return res.status(404).json({message: "Invalid Tokin!"});
}