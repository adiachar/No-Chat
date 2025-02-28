import {createSlice} from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect("http://192.168.15.176:5000");

const initialState = {
    outgoingMsg: "",
    allMessages: [],
    user: {_id: "", userName: "", email: ""},
    to: "",
    connections: [],
    connectionRequests: [],
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
            for(let connection of state.connections){
                if(incommingMsg.from === connection._id){
                    connection.msg = incommingMsg.msg;
                }
            }
        },

        setUser: (state, action) => {
            state.user = action.payload;
        },

        setConnections: (state, action) => {
            state.connections = action.payload;
            for(let connection of state.connections){
                connection.msg = "";
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