const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    profilePic: {
        type: String,
        default: "noPic",
    },
    password: {
        type: String,
        required: true,
    },
    connections: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    connectionRequests: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
    community: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Community"},
    ],
    conversationIds: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Conversation"}
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;