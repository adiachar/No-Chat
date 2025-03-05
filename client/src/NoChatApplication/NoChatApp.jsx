import { useEffect, useState } from "react";
import Chat from "./Chat/Chat.jsx";
import Header from "./Header/Header.jsx";
import io from "socket.io-client";
import "./NoChatApp.css";
import SignUp from "./Sign/SignUp.jsx";
import SignIn from "./Sign/SignIn.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {setIncommingMsg, setUser} from "../features/NoChatApp/noChatAppSlice.js";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MyConnections from "./Connections/MyConnections.jsx";
import MakeConnections from "./Connections/MakeConnections.jsx";
import ConnectionRequests from "./Connections/ConnectionRequests.jsx";
import axios from "axios";

const socket = io(`http://192.168.37.22:5000`);

export default function NoChatApp(){
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const to = useSelector((state) => state.to);
    const ip = useSelector((state) => state.ip);

    useEffect(() => {
        async function validateSession(){
            axios.get(`http://${ip}:5000/user/validateSession`, {withCredentials: true})
            .then((res) => {
                if(res.data.valid){
                    let user = res.data.user;
                    socket.emit("register", {_id: user._id});
                    dispatch(setUser(user));
                    navigate("/");
                }else{
                    navigate("/SignIn");
                }
            }).catch((err) => {
                console.log("error");
            });
        }
        if(!user._id){
            validateSession();
        }
    },[user]);

    socket.on("response", (incommingMsg) => {
        if(incommingMsg.to == user._id){
            dispatch(setIncommingMsg(incommingMsg));
        }
    });

    const noHeaderRouts = ["/SignIn", "/SignUp", "/chat"];

    return(
        <div className="NoChatApp">
            {(!noHeaderRouts.includes(location.pathname) && user._id) && <Header symbol={user.userName.toUpperCase()[0]}/>}
            <Routes>
                <Route path="/" element={<MyConnections/>}/>
                <Route path="/chat" element={<Chat/>} />
                <Route path="/SignUp" element={<SignUp/>} />
                <Route path="/SignIn" element={<SignIn/>} />
                <Route path="/MakeConnections" element={<MakeConnections/>} />
                <Route path="/ConnectionRequests" element={<ConnectionRequests/>} />
            </Routes>
        </div>
    );
}