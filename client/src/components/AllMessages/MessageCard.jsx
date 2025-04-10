import AccountSymbl from "../Header/AccountSymbl";
import { useNavigate } from "react-router-dom";
import { Button} from "@mui/material";
import "./MessageCard.css";
import { useState } from "react";
import { useSelector } from "react-redux";


export default function MessageCard({connection, btn1, btn2}){
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const isDarkMood = useSelector(state => state.isDarkMood);
    
    function handleclick(){
        if(typeof(btn1) == "undefined" && typeof(btn2) == "undefined"){
            navigate("/chat", {state: connection._id});
        }
    }

    return(
        <div className="MessageCard" onClick={handleclick}>
            <AccountSymbl userName={connection ? connection.userName : "A"} isOnline={connection.isOnline}/>
            <div className="body">
                <h3 style={isDarkMood ? {color: "red"} : {}}>{connection.userName ? connection.userName : "unknown"}:</h3>
                {(btn1 && !btn2) && (
                    <div className="btnContainer">
                        <Button variant="outlined"
                        color="success" disabled={isClicked} onClick={() => {setIsClicked(true);
                        btn1(connection._id)}}>Connect</Button>
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
                {(!btn1 && !btn2) ? (
                <div className="message">
                    {!btn1 && !btn2 ? <p style={isDarkMood ? {color: "#ffff"} : {}}>{connection.msg}</p> : null}
                </div>
                ): null}
            </div>
        </div>
    );
}