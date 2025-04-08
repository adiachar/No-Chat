import {createSlice} from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const initialState = {
    allMessages: [],
    user: {_id: "", userName: "", email: ""},
    to: "",
    connections: {},
    connectionRequests: [],
    headers: {}
}
const noChatSlice = createSlice({
    name: "noChat",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        
        setHeaders: (state, action) => {
            state.headers = {
                authorization: `Bearer ${action.payload}`
            }
        },

        sendMessage: (state, action) => {
            let from = state.user._id;
            let msg = action.payload.msg;
            let to = action.payload.to;
            socket.emit("message", {from: from, msg: msg, to: to});
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
    setHeaders,
    setConnections,
    setConnectionRequests,
} = noChatSlice.actions;

export default noChatSlice.reducer;