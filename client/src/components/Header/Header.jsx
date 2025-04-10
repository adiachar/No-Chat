import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Fab } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {useSelector} from "react-redux";
import { useState } from "react";
import Options from "./Options";
import "./Header.css";
import Account from "./Account";

export default function Header({symbol}){
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const isDarkMood = useSelector(state => state.isDarkMood);

    const [btnSelect, setBtnSelect] = useState("chat");
    const [showOptions, setShowOptions] = useState(false);
    const [showAccount, setShowAccount] = useState(false);


    function handleClick(address, btn){
        navigate(address);
        setBtnSelect(btn);
    }
    
    return(
        <div className="Header">
            <div className="header">
                <h1 style={isDarkMood ? {color: "#ffff"}: {}}>{user.userName}</h1>
                <Stack spacing={1} direction="row">
                    <Fab color="" aria-label="add" className="iconBtn" style={isDarkMood ? {borderColor: "white"}: {}}
                    onClick={() => navigate("/connection-requests")}>
                        <NotificationsNoneIcon className="icon" style={isDarkMood ? {color: "#a99af4"} : {}}/>
                    </Fab>
                    <Fab color="" aria-label="add" className="iconBtn" style={isDarkMood ? {borderColor: "white"}: {}}>
                        <MoreVertIcon className="icon" onClick={() => setShowOptions(!showOptions)} style={isDarkMood ? {color: "#a99af4"} : {}}/>
                    </Fab>
                </Stack>
            </div>

            {showOptions && <Options setShowAccount={setShowAccount}/>}
            {showAccount && <Account/>}

            <div className="navigation">
                <Stack spacing={0} direction="row" className="btns" style={isDarkMood ? {backgroundColor: "#fff2"} : {}}>
                    <Button variant={btnSelect == "chat" ? "contained" : "text"} 
                    onClick ={() =>{handleClick("/", "chat")}} 
                    className={`btn btnLeft ${btnSelect == "chat" ? "selected" : ""}`}
                    style={isDarkMood ? {color: "#fff9"}: {}}>All Chat</Button>

                    <Button variant={btnSelect == "connect" ? "contained" : "text"} 
                    onClick={() => {handleClick("/make-connections", "connect")}} 
                    className={`btn  ${btnSelect == "connect" ? "selected" : ""}`}
                    style={isDarkMood ? {color: "#fff9"}: {}}>Connect</Button>

                    <Button variant={btnSelect == "community" ? "contained" : "text"} 
                    onClick={() => { /*community*/}} 
                    className={`btn btnRight  ${btnSelect == "community" ? "selected" : ""}`}
                    style={isDarkMood ? {color: "#fff9"}: {}}>Community</Button>
                </Stack>
            </div>
        </div>
    );
}