import axios from "axios";
import {useSelector } from "react-redux";
import RequestCard from "../cards/RequestCard";

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
        <div className="max-h-10/12 w-full px-6 overflow-y-auto flex flex-col gap-6">
            {connectionRequests.length == 0 ? <h1 style={hStyle}>No Requests!</h1> :connectionRequests.map((request, idx) => { 
                return ( 
                    <div className="user" key={idx}>
                        <RequestCard request={request} acceptRequest={acceptRequest} rejectRequest={rejectRequest}/>
                    </div>
                )}
            )}
        </div>
    );
}