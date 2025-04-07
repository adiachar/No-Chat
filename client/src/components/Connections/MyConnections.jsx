import MessageCard from "../AllMessages/MessageCard.jsx";
import "./MyConnections.css";
import { useDispatch, useSelector} from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setConnections } from "../../features/NoChatApp/noChatAppSlice.js";

export default function MyConnections(){
    const connections = useSelector((state) => state.connections);
    const connectionRequests = useSelector((state) => state.connectionRequests);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if(token) {
            axios.get(`http://localhost:5000:5000/data/connections`)
            .then((res) => {
                if(res.data.connections){
                    let connections = res.data.connections;
                    dispatch(setConnections(connections));
                }else{
                    console.log("Did not received connections from server");
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }, []);

    return(
        <div className="MyConnections">
            {connections ? Object.entries(connections).map(([key, value]) => (
                <MessageCard connection = {value} key={key}/>
            )): <h1 className="noConnections">No Connections! Try making new connections</h1>}
        </div>
    );
}