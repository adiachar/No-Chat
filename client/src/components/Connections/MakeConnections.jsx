import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MessageCard from "../AllMessages/MessageCard";

export default function MakeConnections(){
    const [allUsers, setAllUsers] = useState([]);
    const user = useSelector((state) => state.user);
    const headers = useSelector((state) => state.headers);

    const getAllUsers = async () => {

        let token = localStorage.getItem("token");

        if(token) {
            let response = await axios.get(`http://localhost:5000/data/allUsers`, {headers});
            
            if(response.status === 200 ) {
                setAllUsers(response.data.allUsers);
            }
        }
    }

    useEffect(() => {
        getAllUsers();

    }, []);

    function requestConnection(to_id){
        console.log("making connection");
        axios.post(`http://localhost:5000/connection/request-connection`, {to_id: to_id}, {headers})
        .then((res) => {
            if(res.status === 200) {
                console.log("Request Sent!");
            } else {
                console.log("not working!");
            }
        }).catch((err) => {
            console.log("error: " +err);
        });
    }

    return (
        <div className="MakeConnections">
            <div className="user">
                {allUsers.map((oUser, idx) => { 
                    return ( oUser.email !== user.email ? 
                    ( <div className="user" key={idx}>
                        <MessageCard connection={oUser} btn1={requestConnection} />
                    </div> ) : null) }
                )} 
            </div>
        </div>
    );
}