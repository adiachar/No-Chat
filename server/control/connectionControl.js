const User = require("../model/user.js");

module.exports.connectionRequest = async (req, res) => {
    let {from, to} = req.body;
    let result = await User.findByIdAndUpdate(to, {$push: {connectionRequests: from}}, {new: true});
    if(result){
        res.status(200).send("success")
    }else{
        res.status(200).send("failure");
    }
}

module.exports.acceptConnection = async (req, res) => {
    let {from, to} = req.body;
    try{
        await User.findByIdAndUpdate(from, {$push: {connections: to}});
        await User.findByIdAndUpdate(to, {$push: {connections: from}});
        await User.findByIdAndUpdate(from, {$pull: {connectionRequests: to}});
        let data = await User.findById(from, "connections").populate({path: connections, select: "userName email"});
        const connections = data.connections;
        const connectionRequests = data.connectionRequests;
        res.json({connections: connections, connectionRequests: connectionRequests});
    }catch(err){
        res.send("failure");
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