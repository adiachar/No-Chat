import { useContext, useEffect, useState } from "react";
import Chat from "./Chat/Chat.jsx";
import Header from "./header/Header.jsx";
import io from "socket.io-client";
import SignUp from "./user/SignUp.jsx";
import SignIn from "./user/SignIn.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {setUser, setConnectionRequests, setConnections, setHeaders, setConversations, updateMessage, setTypingMessage} from "../features/NoChatApp/noChatAppSlice.js";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MyConnections from "./connections/MyConnections.jsx";
import MakeConnections from "./connections/MakeConnections.jsx";
import ConnectionRequests from "./connections/ConnectionRequests.jsx";
import axios from "axios";
import "./NoChatApp.css";

const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

export default function NoChatApp(){

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const isDarkMood = useSelector((state) => state.isDarkMood);
    const headers = useSelector(state => state.headers);

    useEffect(() => {

        async function validateToken(token){

            const headers = {
                Authorization: `Bearer ${token}`
            }

            try{
                const response = await axios.get(`https://nochat.onrender.com/user/validateToken`, {headers});

                if(response.status === 200) {

                    localStorage.setItem("token", response.data.token);

                    const user = {
                        _id: response.data.user._id,
                        userName: response.data.user.userName,
                        email: response.data.user.email
                    }

                    dispatch(setUser(user));
                    dispatch(setHeaders(response.data.token));
                    dispatch(setConnections(response.data.user.connections));
                    dispatch(setConnectionRequests(response.data.user.connectionRequests));
                    socket.emit("register", {_id: response.data.user._id});
                    navigate("/");
                } else {
                    navigate("/sign-in");
                }

            } catch(err) {
                console.log(err);
                navigate("/sign-in"); 
            }
        }

        const token = localStorage.getItem("token");

        if(token) {
            validateToken(token);
            
        } else {
            navigate('/sign-in');
        }

    },[]);

    useEffect(() => {

        const newMessage = (obj) => {
            dispatch(updateMessage(obj));
        }

        const updateTypingMessage = (obj) => {
            dispatch(setTypingMessage(obj));
        }
        socket.on("message:new", newMessage);  
        socket.on("message:typing:update", updateTypingMessage);  
        
        return () => {
            socket.off("message:new", newMessage);
            socket.off("message:typing:update", updateTypingMessage);
        }
    }, []);





    const noHeaderRouts = ["/sign-in", "/sign-up", "/chat"];

    return(
        <div className="h-screen w-screen relative" style={isDarkMood ? {backgroundColor: "black"} : {}}>
            {(!noHeaderRouts.includes(location.pathname)) && <Header/>}
            <Routes>
                <Route path="/*" element={<MyConnections/>}/>
                <Route path="/chat" element={<Chat/>} />
                <Route path="/sign-up" element={<SignUp/>} />
                <Route path="/sign-in" element={<SignIn/>} />
                <Route path="/make-connections" element={<MakeConnections/>} />
                <Route path="/connection-requests" element={<ConnectionRequests/>} />
            </Routes>
        </div>
    );
}