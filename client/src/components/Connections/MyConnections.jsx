import MessageCard from "../AllMessages/MessageCard.jsx";
import { useSelector} from "react-redux";
import "./MyConnections.css";

export default function MyConnections(){

    const connections = useSelector((state) => state.connections);

    return(
        <div className="MyConnections">
            {connections ? Object.entries(connections).map(([key, value]) => (
                <MessageCard connection = {value} key={key}/>
            )): <h1 className="noConnections">No Connections! Try making new connections</h1>}
        </div>
    );
}