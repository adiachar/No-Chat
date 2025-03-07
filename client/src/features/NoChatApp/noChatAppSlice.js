import {createSlice} from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect("http://192.168.96.22:5000");

const initialState = {
    outgoingMsg: "",
    allMessages: [],
    user: {_id: "", userName: "", email: ""},
    to: "",
    connections: {},
    connectionRequests: [],
    ip: "192.168.96.22",
}
const noChatSlice = createSlice({
    name: "noChat",
    initialState,
    reducers: {
        sendMessage: (state, action) => {
            let msg = action.payload.msg;
            let to = action.payload.to;
            socket.emit("message", {from: state.user._id, msg: msg, to: to});
        },

        clearMessage: (state, action) => {
            state.outgoingMsg = "";
        },

        setIncommingMsg: (state, action) => {
            let incommingMsg = action.payload;
            state.connections[incommingMsg.from].msg = incommingMsg.msg;
        },

        setUser: (state, action) => {
            state.user = action.payload;
        },

        setConnections: (state, action) => {
            for(let connection of action.payload){
                state.connections[connection._id] = {...connection, msg: "..."};
            }
        },

        setConnectionRequests: (state, action) => {
            state.connectionRequests = action.payload;
        }
    }
});

export const {
    sendMessage, 
    clearMessage, 
    setIncommingMsg, 
    setUser, 
    setConnections,
    setConnectionRequests,
} = noChatSlice.actions;

export default noChatSlice.reducer;