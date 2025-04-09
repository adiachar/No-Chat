import { useContext, useEffect, useState } from "react";
import Chat from "./Chat/Chat.jsx";
import Header from "./Header/Header.jsx";
import io from "socket.io-client";
import "./NoChatApp.css";
import SignUp from "./user/SignUp.jsx";
import SignIn from "./user/SignIn.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {setIncommingMsg, setUser, setConnectionRequests, setConnections, setHeaders} from "../features/NoChatApp/noChatAppSlice.js";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MyConnections from "./Connections/MyConnections.jsx";
import MakeConnections from "./Connections/MakeConnections.jsx";
import ConnectionRequests from "./Connections/ConnectionRequests.jsx";
import axios from "axios";

const socket = io(`https://nochat.onrender.com`);

export default function NoChatApp(){

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

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
                    navigate('/');

                } else {
                    navigate("/sign-in");
                }

            } catch(err) {
                console.log(err);
                navigate("/sign-in")
            }
        }

        const token = localStorage.getItem("token");

        if(token && location.pathname != "/sign-in"){
            console.log(location.pathname);
            validateToken(token);
        }

    },[]);

    socket.on("response", (incommingMsg) => {
        if(incommingMsg.to == user._id){
            dispatch(setIncommingMsg(incommingMsg));
        }
    });

    const noHeaderRouts = ["/sign-in", "/sign-up", "/chat"];

    return(
        <div className="NoChatApp">
            {(!noHeaderRouts.includes(location.pathname) && user._id) && <Header symbol={user.userName.toUpperCase()[0]}/>}
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