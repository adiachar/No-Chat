import {createSlice} from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect(import.meta.env.VITE_WEB_SOCKET_URL);

const initialState = {
    allMessages: [],
    user: {_id: "", userName: "", email: ""},
    to: "",
    connections: {},
    conversations: {},
    connectionRequests: [],
    headers: {},
    isDarkMood: false
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
            socket.emit("message:send", action.payload);
        },

        sendTypingMessage: (state, action) => {
            socket.emit("message:typing", action.payload);
        },

        setTypingMessage: (state, action) => {
            let obj = action.payload;
            let con_id = [obj.from, obj.to].sort().join("_");
            let messages = state.conversations[con_id]?.messages;
            state.conversations = {...state.conversations, [con_id]: {messages: messages, typingMessage: obj.message}};
        },

        setConnections: (state, action) => {
            for(let connection of action.payload){
                state.connections[connection._id] = connection;
            }
        },

        setConversations: (state, action) => {
            const {con_id, messages} = action.payload;
            state.conversations = {...state.conversations, [con_id]: {messages: messages, typingMessage: ""}};
        },

        updateMessage: (state, action) => {
            const {from, to} = action.payload;
            let con_id = [to, from].sort().join("_");
            const messages = state.conversations[con_id].messages;
            messages.push(action.payload);
            state.conversations = {...state.conversations, [con_id] : {messages: messages, typingMessage: ""}}
        },

        setConnectionRequests: (state, action) => {
            state.connectionRequests = action.payload;
        },

        setIsDarkMood: (state, payload) => {
            state.isDarkMood = !state.isDarkMood;
        }
    }
});

export const {
    sendMessage, 
    clearMessage, 
    setTypingMessage, 
    setUser, 
    setHeaders,
    setConnections,
    setConnectionRequests,
    setIsDarkMood,
    setConversations,
    updateMessage,
    sendTypingMessage,
} = noChatSlice.actions;

export default noChatSlice.reducer;