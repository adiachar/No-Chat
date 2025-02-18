import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { Fab } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useLocation, useNavigate} from "react-router-dom";
import "./Chat.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Chat(){
    const location = useLocation();
    const navigate = useNavigate();
    const connectionId = location.state;
    let AllConnections = useSelector((state) => state.connections);
    let [connection, setConnection] = useState({});
    useEffect(() => {
        for(let connec of AllConnections){
            if(connec._id === connectionId){
                setConnection(connec);
            }
        }
    },[AllConnections]);
    return(
        <div className="Chat">
            <div className="back">
                <Fab color="" size="large" 
                className="iconFab" 
                onClick={() => navigate("/")}>
                    <CloseIcon fontSize="medium" className="icon"/>
                </Fab>
            </div>
            <ChatMessage connection={connection}/>
            <ChatInput connectionId={connectionId}/>
        </div>
    );
} 