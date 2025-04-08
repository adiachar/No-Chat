import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setConnections} from "../../features/NoChatApp/noChatAppSlice";
import MessageCard from "../AllMessages/MessageCard";
import { setConnectionRequests } from "../../features/NoChatApp/noChatAppSlice";

let hStyle = {width: "100%", marginTop: "2rem", textAlign: "center", color: "rgba(0, 0, 0, 0.464)"};

export default function ConnectionRequests(){
    const user = useSelector((state) => state.user);
    const headers = useSelector((state) => state.headers);

    const dispatch = useDispatch();

    const connectionRequests = useSelector((state) => state.connectionRequests);

    function acceptRequest(to_id){
        axios.post(`http://localhost:5000/connection/accept`, {to_id: to_id}, {headers})
        .then((res) => {
            console.log(res.data.message);
        }).catch((err) => {
            console.log(err);
        });
    }

    function rejectRequest(to_id){
        axios.post(`http://localhost:5000/connection/reject`, {to_id: to_id}, {headers})
        .then((res) => {
            console.log(res.data.message);
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