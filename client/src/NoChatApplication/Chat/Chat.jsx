import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { Fab } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import {useLocation, useNavigate} from "react-router-dom";
import ch from "./Chat.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Chat(){
    const location = useLocation();
    const navigate = useNavigate();
    const connectionId = location.state;
    const [msgHeight, setMsgHeight] = useState("100vh");
    const [chatHeight, setChatHeight] = useState("0vh");
    let [messages, setMessages] = useState([]);
    let user = useSelector(state => state.user);

    useEffect(() => {
        getChat();
    }, []);

    function showChat(){
        if(msgHeight == "100vh"){
            setMsgHeight("2vh");
            setChatHeight("90vh");
            getChat();
        }else{
            setMsgHeight("100vh");
            setChatHeight("0vh");
        }
    }

    async function getChat(){
        axios.get(`https://nochat.onrender.com/data/conversation/${connectionId}`, {withCredentials: true})
        .then((res) => {
            if(res.data){
                setMessages(res.data);
            }else{
                console.log("Did not received connections from server");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return(
        <div className={ch.Chat}>
            <div className={ch.btns}>
                <Fab variant="extended" size="large" className={ch.chatIcon} onClick={() => showChat()}>
                    <p>{chatHeight != "0vh" ? "Close Chat":"See Chat"}</p>
                    <ChatIcon fontSize="medium" className="icon"/>
                </Fab>
                <Fab size="large" 
                className={ch.backIcon}
                onClick={() => navigate("/")}>
                    <CloseIcon fontSize="medium" className="icon"/>
                </Fab>
            </div>
            <div className={ch.seeChat} style={{height: chatHeight, padding: chatHeight != "0vh" ? "1.5rem": "0" }}>
                {messages && messages.map((msg, idx) => {
                    return(
                        <div className={ch.msg} key={idx}>
                            {(msg.from == user._id ? (
                                <>
                                    <div className={ch.msgSent}>
                                        <p>{msg.message}</p>
                                        <p className={ch.time}>{msg.time.slice(11, 16)}</p>
                                    </div>                                
                                </>
                            ):(
                                <>
                                    <div className={ch.msgReceived}>
                                        <p>{msg.message}</p>
                                        <p className={ch.time}>{msg.time.slice(11, 16)}</p>
                                    </div>                                
                                </>
                            ))}
                        </div>
                    )
                })}
            </div>
            <div className={ch.message} style={{height: msgHeight, overflow: "hidden"}}>
                <ChatMessage connectionId={connectionId}/>
                <ChatInput connectionId={connectionId} updateChat={getChat}/>
            </div>
        </div>
    );
} 