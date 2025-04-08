import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Fab } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {useSelector} from "react-redux";
import "./Header.css";
import { useState } from "react";

export default function Header({symbol}){
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [btnSelect, setBtnSelect] = useState("chat");

    function handleClick(address, btn){
        navigate(address);
        setBtnSelect(btn);
    }
    
    return(
        <div className="Header">
            <div className="header">
                <h1>{user.userName}</h1>
                <Stack spacing={1} direction="row">
                    <Fab color="" aria-label="add" className="iconBtn"
                    onClick={() => navigate("/connection-requests")}>
                        <NotificationsNoneIcon className="icon"/>
                    </Fab>
                    <Fab color="" aria-label="add" className="iconBtn">
                        <MoreVertIcon className="icon"/>
                    </Fab>
                </Stack>
            </div>
            <div className="navigation">
            <Stack spacing={0} direction="row" className="btns">

                <Button variant={btnSelect == "chat" ? "contained" : "text"} 
                onClick ={() =>{handleClick("/", "chat")}} 
                className={`btn btnLeft ${btnSelect == "chat" ? "selected" : ""}`}>All Chat</Button>

                <Button variant={btnSelect == "connect" ? "contained" : "text"} 
                onClick={() => {handleClick("/make-connections", "connect")}} 
                className={`btn  ${btnSelect == "connect" ? "selected" : ""}`}>Connect</Button>

                <Button variant={btnSelect == "community" ? "contained" : "text"} 
                onClick={() => { /*community*/}} 
                className={`btn btnRight  ${btnSelect == "community" ? "selected" : ""}`}>Community</Button>
            </Stack>
            </div>
        </div>
    );
}