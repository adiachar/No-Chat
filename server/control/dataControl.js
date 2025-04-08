const User = require("../model/user.js");
const Message = require("../model/message.js");
const Conversation = require("../model/conversation.js");
const {onlineUsers} = require("../onlineUsers.js");

module.exports.getConnections = async (req, res) => {
    if(req.session.user) {
        let _id = req.session.user._id;
        let data = await User.findById(_id, "connections").populate({path: "connections", select: "userName email"}).lean();
        if(data){
            let connections = data.connections;
            for(let connection of connections){
                connection.isOnline = onlineUsers.has(connection._id.toString());
                let con_id = [_id, connection._id].sort().join("_");
                let conversation = await Conversation.find({con_id: con_id}, "lastMessage");
                connection.msg = conversation[0] ? conversation[0].lastMessage : "---";
                console.log(connection);
            }
            res.json({connections});
        }

    } else {
        console.log("no user");
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        let currUser = await User.findById(req.user._id, "connections connectionRequests").lean();

        let connectedUsers = currUser.connections || [];
        let connectionRequests = currUser.connectionRequests || [];

        let allUsers = await User.find({_id: {$ne: req.user._id, $nin: connectedUsers, $nin: connectionRequests}}, "_id userName email").lean();
        console.log(allUsers);
        return res.status(200).json({allUsers});  

    } catch(err) {
        console.log(err);
        return res.status(404).json({message: "Internal Server Error!"});
    }
}

module.exports.getConnectionRequests = async (req, res) => {
    if(!req.session.user){
        return;
    }
    let _id = req.session.user._id;
    let data = await User.findById(_id, "connectionRequests").populate({path: "connectionRequests", select: "userName email"}).lean(); 
    if(data){
        res.json(data.connectionRequests);
    }
    else{
        res.send([]);
    }
}

module.exports.storeMessage = async (req, res) => {
    let {from, to, message} = req.body;
    const con_id = [from, to].sort().join("_");
    const newMessage = new Message({con_id: con_id, from: from, to: to, message: message});
    try{
        await Conversation.findOneAndUpdate({con_id: con_id}, {$set: {lastMessage: message}});
        await newMessage.save();
        res.status(201).send({success: true});
    }
    catch(err){
        res.status(404).send({success: false});
    };
    
}

module.exports.getMessages = async (req, res) => {
    if(req.session.user){
        const {connectionId} = req.params;
        let con_id = [req.session.user._id, connectionId].sort().join("_");
        try{
            let messages = await Message.find({con_id: con_id});
            res.status(201).json(messages);
        }catch(err){
            res.status(404).send("");
        }
    }
}