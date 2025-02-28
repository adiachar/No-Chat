const User = require("../model/user.js");
const Conversation = require("../model/conversation.js");

module.exports.connectionRequest = async (req, res) => {
    let {from, to} = req.body;
    let result = await User.findByIdAndUpdate(to, {$push: {connectionRequests: from}}, {new: true});
    if(result){
        res.status(200).send("success");
    }else{
        res.status(200).send("failure");
    }
}

module.exports.acceptConnection = async (req, res) => {
    let {from, to} = req.body;
    try{
        //updating the user connection and connectionRequests
        await User.findByIdAndUpdate(from, {$push: {connections: to}});
        await User.findByIdAndUpdate(to, {$push: {connections: from}});
        await User.findByIdAndUpdate(from, {$pull: {connectionRequests: to}});

        //creating new conversation document.
        const sortedIds = [from, to].sort().join("_");
        const conversation = new Conversation({con_id: sortedIds, participants: [from, to], lastMessage: "Say hii to your new Friend"});
        await conversation.save();

        //sending updated connection data back.
        let data = await User.findById(from, "connections").populate({path: connections, select: "userName email"});
        const connections = data.connections;
        const connectionRequests = data.connectionRequests;
        res.status(201).json({connections: connections, connectionRequests: connectionRequests});
    }catch(err){
        res.status(404).send("failure");
    }
}

module.exports.rejectConnection = async (req, res) => {
    let {from, to} = req.body;
    console.log("reject");
    let result = await User.updateOne({ _id: from },{ $pull: { connectionRequests: to } });
    let data = await User.findById(from, "connectionRequests").populate({path: "connectionRequests", select: "userName email"});
    const connectionRequests = data.connectionRequests;
    res.json(connectionRequests);
}