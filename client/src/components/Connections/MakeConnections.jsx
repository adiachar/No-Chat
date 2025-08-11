import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConnectCard from "../cards/ConnectCard.jsx";
import ChatCard from "../cards/ChatCard.jsx";

export default function MakeConnections(){
    const [allUsers, setAllUsers] = useState([]);
    const user = useSelector((state) => state.user);
    const headers = useSelector((state) => state.headers);

    const getAllUsers = async () => {

        let token = localStorage.getItem("token");

        if(token) {
            let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/data/allUsers`, {headers});
            
            if(response.status === 200 ) {
                setAllUsers(response.data.allUsers);
            }
        }
    }

    useEffect(() => {
        getAllUsers();

    }, []);

    function requestConnection(to_id){
        console.log("making connection", to_id);
        axios.post(`${import.meta.env.VITE_SERVER_URL}/connection/request-connection`, {to_id: to_id}, {headers})
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
        <div className="h-12/12 pt-50 px-6 w-full overflow-y-auto flex flex-col gap-6">
            {allUsers.length > 0 ? allUsers.map((oUser, idx) => { 
                    return ( oUser.email !== user.email ? 
                    ( <div className="user" key={idx}>
                        <ConnectCard oUser={oUser} requestConnection={requestConnection} />
                    </div> ) : null) }
            ) :
            Array(5).fill(null).map((_, key) => <ChatCard user={""} key={key}/>)
            }
        </div>
    );
}