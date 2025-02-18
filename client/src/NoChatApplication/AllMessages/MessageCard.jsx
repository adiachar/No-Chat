import AccountSymbl from "../Header/AccountSymbl";
import { useNavigate } from "react-router-dom";
import { Button} from "@mui/material";
import "./MessageCard.css";
import { useState } from "react";


export default function MessageCard({connection, btn1, btn2}){
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    function handleclick(){
        if(typeof(btn1) == "undefined" && typeof(btn2) == "undefined"){
            navigate("/chat", {state: connection._id});
        }
    }

    return(
        <div className="MessageCard" onClick={handleclick}>
            <div className="header">
                <AccountSymbl userName={connection ? connection.userName : "A"} isOnline={connection.isOnline}/>
                <h3>{connection.userName ? connection.userName : "unknown"}:</h3>
                {(btn1 && !btn2) && (
                    <div className="btnContainer">
                        <Button variant="outlined" color="success" disabled={isClicked} onClick={() => {setIsClicked(true);btn1(connection._id)}}>Connect</Button>
                    </div>
                )}

                {(btn1 && btn2) && (
                    <div className="btnContainer">
                        <Button variant="outlined" 
                        color="success" 
                        className="btn" 
                        size="small"
                        disabled={isClicked}
                        onClick={() => {setIsClicked(true); btn1(connection._id)}}
                        >Accept</Button>
                        <Button 
                        variant="outlined" 
                        color="warning" 
                        className="btn" 
                        size="small"
                        disabled={isClicked}
                        onClick={() => {setIsClicked(true); btn2(connection._id)}}>Reject</Button>
                    </div>
                )}
            </div>

            {(!btn1 && !btn2) ? (
            <div className="body">
                {!btn1 && !btn2 ? <p>{connection.msg}</p> : null}
            </div>
            ): null}
        </div>
    );
}