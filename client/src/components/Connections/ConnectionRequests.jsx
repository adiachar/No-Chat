import axios from "axios";
import {useSelector } from "react-redux";
import MessageCard from "../AllMessages/MessageCard";

let hStyle = {width: "100%", marginTop: "2rem", textAlign: "center", color: "rgba(0, 0, 0, 0.464)"};

export default function ConnectionRequests(){
    const headers = useSelector((state) => state.headers);

    const connectionRequests = useSelector((state) => state.connectionRequests);

    function acceptRequest(to_id){
        axios.post(`https://nochat.onrender.com/connection/accept`, {to_id: to_id}, {headers})
        .then((res) => {
            console.log(res.data.message);
        }).catch((err) => {
            console.log(err);
        });
    }

    function rejectRequest(to_id){
        axios.post(`https://nochat.onrender.com/connection/reject`, {to_id: to_id}, {headers})
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