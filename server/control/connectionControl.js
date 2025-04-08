const User = require("../model/user.js");
const Conversation = require("../model/conversation.js");

module.exports.requestConnection = async (req, res) => {
    let {to_id} = req.body;

    try {
        let result = await User.findByIdAndUpdate(to_id, {$push: {connectionRequests: req.user_id}}, {new: true});

        return res.status(200).json({message: "Request sent!"});

    } catch(err) {
        return res.status(404).json({message: "Internal Server Error!"});
    }
}

module.exports.acceptConnection = async (req, res) => {
    let {to_id} = req.body;

    try {
        //updating the user connection and connectionRequests
        await User.findByIdAndUpdate(req.user_id, {$push: {connections: to_id}});
        await User.findByIdAndUpdate(to_id, {$push: {connections: req.user_id}});
        await User.findByIdAndUpdate(req.user_id, {$pull: {connectionRequests: to_id}});

        //creating new conversation document.
        const con_id = [req.user_id, to_id].sort().join("_");
        const conversation = new Conversation({con_id: con_id, participants: [req.user_id, to_id], lastMessage: "Say hii to your new Friend"});
        await conversation.save();

        return res.status(200).json({message: "Request Accepted!"});

    } catch(err) {
        console.log(err);
        return res.status(404).json({message: "Internal Server Error!"});
    }
}

module.exports.rejectConnection = async (req, res) => {
    let {to_id} = req.body;
    try {
        let result = await User.updateOne({_id: req.user_id}, {$pull: { connectionRequests: to_id }});
        return res.status(200).json({messge: "Request Rejected!"});

    } catch(err) {
        return res.status(404).json({message: "Internal Server Error!"});
    }   
}