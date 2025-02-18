import MessageCard from "../AllMessages/MessageCard.jsx";
import "./MyConnections.css";
import { useDispatch, useSelector} from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setConnections } from "../../features/NoChatApp/noChatAppSlice.js";

export default function MyConnections(){
    const connections = useSelector((state) => state.connections);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("getting all connections");
            axios.get(`http://192.168.180.22:5000/data/connections`, {withCredentials: true})
            .then((res) => {
                console.log("got response: " +res.data.connections);
                if(res.data.connections){
                    let connections = res.data.connections;
                    dispatch(setConnections(connections));
                }else{
                    console.log("Did not received connections from server");
                }
            }).catch((err) => {
                console.log(err);
            });
        }, []);

    return(
        <div className="MyConnections">
         {connections.length > 0 ? connections.map((connection, idx) => (
                <MessageCard connection = {connection} key={idx}/>
            )) : <h1 className="noConnections">No Connections! Try making new connections</h1> }
        </div>
    );
}