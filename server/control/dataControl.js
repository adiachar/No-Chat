const User = require("../model/user.js");
const Message = require("../model/message.js");
const Conversation = require("../model/conversation.js");
const {onlineUsers} = require("../onlineUsers.js");

module.exports.getAllUsers = async (req, res) => {
    try {
        let currUser = await User.findById(req.user_id, "connections connectionRequests").lean();

        let excludedUsers = [...currUser.connections, ...currUser.connectionRequests];

        let allUsers = await User.find({_id: {$ne: req.user_id, $nin: excludedUsers}}, "_id userName email").lean();

        return res.status(200).json({allUsers});  

    } catch(err) {
        console.log(err);
        return res.status(404).json({message: "Internal Server Error!"});
    }
}

module.exports.storeMessage = async (req, res) => {

    const {to_id, message} = req.body;

    const con_id = [req.user_id, to_id].sort().join("_");
    const newMessage = new Message({con_id: con_id, from: req.user_id, to: to_id, message: message});

    try {
        await Conversation.findOneAndUpdate({con_id: con_id}, {$set: {lastMessage: message}});
        await newMessage.save();

        return res.status(200).json({message: "message saved!"});

    } catch(err) {
        return res.status(404).send({message: "Internal Server Error!"});
    };
}

module.exports.getMessages = async (req, res) => {
    const {conversationId} = req.params;

    try {
        let messages = await Message.find({con_id: conversationId});
        return res.status(200).json({message: "got all messages!", messages: messages});

    } catch(err) {
        return res.status(404).json({message: "Internal Server Error!"});
    }
}