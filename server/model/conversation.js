const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    con_id: {
        type: String,
        unique: true,
        index: true,
    },
    participants: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    lastMessage: String,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;