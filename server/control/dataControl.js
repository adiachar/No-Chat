const User = require("../model/user.js");
const Message = require("../model/message.js");
const {onlineUsers} = require("../onlineUsers.js");

module.exports.getConnections = async (req, res) => {
    if(req.session.user){
        let _id = req.session.user._id;
        let data = await User.findById(_id, "connections").populate({path: "connections", select: "userName email"}).lean();
        if(data){
            let connections = data.connections;
            for(let connection of connections){
                let id = connection._id.toString();
                connection.isOnline = onlineUsers.has(id);
            }
            res.json({connections});
        }
    }else{
        console.log("no user");
    }
}

module.exports.getUsers = async (req, res) => {
    let allUsers = await User.find({}, "_id email userName").lean();
    res.json(allUsers);
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