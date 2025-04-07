import {createSlice} from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const initialState = {
    outgoingMsg: "",
    allMessages: [],
    user: {_id: "", userName: "", email: ""},
    to: "",
    connections: {},
    connectionRequests: [],
}
const noChatSlice = createSlice({
    name: "noChat",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        
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

        setConnections: (state, action) => {
            for(let connection of action.payload){
                state.connections[connection._id] = connection;
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