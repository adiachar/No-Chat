const User = require("../model/user.js");
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