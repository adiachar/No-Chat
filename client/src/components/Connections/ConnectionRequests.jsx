import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setConnections} from "../../features/NoChatApp/noChatAppSlice";
import MessageCard from "../AllMessages/MessageCard";
import { setConnectionRequests } from "../../features/NoChatApp/noChatAppSlice";

let hStyle = {width: "100%", marginTop: "2rem", textAlign: "center", color: "rgba(0, 0, 0, 0.464)"};

export default function ConnectionRequests(){
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const connectionRequests = useSelector((state) => state.connectionRequests);

    useEffect(() => {
        if(connectionRequests){
            console.log("making connection request");
            axios.get(`http://localhost:5000/data/connectionRequests`, {withCredentials: true})
            .then((res) => {
                console.log(res.data);
                let connectionRequests = res.data;
                dispatch(setConnectionRequests(connectionRequests));
            }).catch((err) => console.log(err));            
        }
    },[]);

    function acceptRequest(_id){
        axios.post(`http://localhost:5000/connection/accept`, {from: user._id, to: _id})
        .then((res) => {
            if(res.data.connectionRequests && res.data.connections){
                let connections = res.data.connections;
                let connectionRequests = res.data.connectionRequests;
                dispatch(setConnections(connections));
                dispatch(setConnectionRequests(connectionRequests));
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    function rejectRequest(_id){
        axios.post(`http://localhost:5000/connection/reject`, {from: user._id, to: _id})
        .then((res) => {
            if(res.data.connectionRequests){
                let connectionRequests = res.data.connectionRequests;
                dispatch(setConnectionRequests(connectionRequests));
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return(
        <div className="ConnectionRequests">
            {connectionRequests.length == 0 ? <h1 style={hStyle}>No Requests!</h1> :connectionRequests.map((request, idx) => { 
                return ( <div className="user" key={idx}>
                    <MessageCard connection={request} btn1={acceptRequest} btn2={rejectRequest}/>
                </div> )}
            )}
        </div>
    );
}