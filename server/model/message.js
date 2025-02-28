const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    con_id: String,
    from: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    to: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    message: String,
    time: Date,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;