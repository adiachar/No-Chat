import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Fab } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {useSelector} from "react-redux";
import { useState } from "react";
import Options from "./Options";
import AccountInfo from "./AccountInfo.jsx";

export default function Header(){
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
        <div className={`w-full pt-10 pb-6 px-6 z-30 flex flex-col justify-start absolute top-0 ${isDarkMood ? "bg-black" : "bg-white"}`}>
            <div className="flex justify-between mb-4 items-center">
                {user._id ? <h1 
                    className="text-4xl font-bold" 
                    style={isDarkMood ? {color: "#ffff"}: {}}
                    >{user.userName.slice(0, 10)} {user.userName.length > 9 && "..."}
                </h1> : 
                <div className="w-1/2 p-6 bg-gray-300 rounded-2xl"></div>}

                <Stack spacing={1} direction="row">
                    <Fab 
                        color="" 
                        aria-label="add" 
                        style={{border: "2px solid #6041F9", borderColor: isDarkMood ? "white": "indigo", backgroundColor: "transparent", boxShadow: "none"}}
                        onClick={() => navigate("/connection-requests")}>
                        <NotificationsNoneIcon style={isDarkMood ? {color: "#a99af4"} : {}}/>
                    </Fab>
                    <Fab 
                        color="" 
                        aria-label="add" 
                        style={{border: "2px solid #6041F9", borderColor: isDarkMood ? "white": "indigo", backgroundColor: "transparent", boxShadow: "none"}}
                        onClick={() => setShowOptions(!showOptions)}>
                        <MoreVertIcon style={isDarkMood ? {color: "#a99af4"} : {}}/>
                    </Fab>
                </Stack>
            </div>
            
            {showOptions && <Options setShowAccount={setShowAccount}/>}
            {showOptions && showAccount && <AccountInfo/>}

            <div 
                style={{backgroundColor: isDarkMood ? "#fff2" : ""}}
                className="w-full bg-gray-200 rounded-full">
                <Stack
                    spacing={0} 
                    direction="row"
                    className="rounded-full">
                    <Button 
                        variant={btnSelect == "chat" ? "contained" : "text"} 
                        onClick ={() =>{handleClick("/", "chat")}}
                        size="larger"
                        style={{width: "100%", padding: "0.7rem", boxShadow: "none", color: isDarkMood ? (btnSelect == "chat" ? "white" :"#fff9") : (btnSelect == "chat" ? "white" :"gray"), backgroundColor: btnSelect == "chat" ? "#6041F9" : "transparent", borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem"}}
                        >All Chat</Button>

                    <Button 
                        variant={btnSelect == "connect" ? "contained" : "text"} 
                        onClick={() => {handleClick("/make-connections", "connect")}} 
                        size="large"
                        style={{width: "100%", padding: "0.7rem", boxShadow: "none", color: isDarkMood ? (btnSelect == "connect" ? "white" :"#fff9") : (btnSelect == "connect" ? "white" :"gray"), backgroundColor: btnSelect == "connect" ? "#6041F9" : ""}}
                        >Connect</Button>
                    
                    <Button 
                        variant={btnSelect == "community" ? "contained" : "text"} 
                        onClick={() => {}} 
                        size="large"
                        style={{width: "100%", padding: "0.7rem", boxShadow: "none", color: isDarkMood ? (btnSelect == "community" ? "white" :"#fff9") : (btnSelect == "community" ? "white" :"gray"), backgroundColor: btnSelect == "community" ? "#6041F9" : "", borderTopRightRadius: "2rem", borderBottomRightRadius: "2rem"}}
                    >Community</Button>
                </Stack>
            </div>
        </div>
    );
}