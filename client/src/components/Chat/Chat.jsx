import ChatInput from "./ChatInput";
import { Button, Fab } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccountSymbl from "../header/AccountSymbl";
import {useLocation, useNavigate} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {

    const location = useLocation();
    const navigate = useNavigate();
    const connectionId = location.state;
    const user = useSelector(state => state.user);
    const isDarkMood = useSelector(state => state.isDarkMood);
    const connections = useSelector(state => state.connections);
    const conversations = useSelector(state => state.conversations)
    const [messages, setMessages] = useState([]);
    const endRef = useRef(null);
    const isFirstRender = useRef(true);
    const [isRealtime, setIsRealtime] = useState(true);

    let con_id = [user._id, connectionId].sort().join("_");

    useEffect(() => {
        setMessages(conversations[con_id]?.messages || []);
    }, [conversations]);

    useEffect(() => {
        if(isFirstRender.current) {
            endRef.current?.scrollIntoView({behavior: "auto"});
            if(messages.length > 0) {
                isFirstRender.current = false;
            }
        } else {
            endRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [messages, conversations]);

    return (
        <div 
            className="h-full w-full"> 
            <div className="w-full pt-4 pb-2 px-6 flex flex-col justify-between items-start border-b-2 border-b-gray-100" 
                style={isDarkMood ? {backgroundColor: "rgba(255, 255, 255, 0.045)"} : {}}>
                <div className="w-full pt-4 flex justify-between items-start">
                    <div className="flex items-center">
                        <AccountSymbl 
                        userName={connections[connectionId]?.userName || "A"} 
                        isOnline={connections[connectionId]?.isOnline || false}/>
                        <h1
                            className={`text-3xl ${isDarkMood ? "text-red-500": "text-gray-600"} font-bold`}
                            >{connections[connectionId]?.userName || "unknown"}
                        </h1>
                    </div>
                    <Fab size="large" 
                    className=""
                    onClick={() => navigate("/")}
                    style={{backgroundColor: isDarkMood ? "#0f0f0f" : "transparent", color: isDarkMood ? "white" : "gray", boxShadow: "none", border: "2px solid gray"}}>
                        <CloseIcon fontSize="medium" className="text-gray-900"/>
                    </Fab>
                </div>
                <div className="mt-4 bg-gray-300 rounded-full flex">
                    <Button 
                        style={{
                                height: "2.5rem", 
                                width: "5rem", 
                                margin: "0px", 
                                fontSize: "1rem",
                                fontWeight: "700",
                                borderTopLeftRadius: 
                                "1rem", 
                                borderBottomLeftRadius: "1rem",
                                textTransform: "lowercase",
                                boxShadow: "none",
                                backgroundColor: isRealtime ? "#228B22" : "transparent"
                            }}
                        onClick={() => setIsRealtime(true)}
                        variant="contained">Realtime</Button>
                    <Button 
                        style={{
                            height: "2.5rem", 
                            minWidth: "5rem",
                            margin: "0px", 
                            fontSize: "1rem",
                            fontWeight: "700",
                            borderTopRightRadius: "1rem", 
                            borderBottomRightRadius: "1rem",
                            textTransform: "lowercase",
                            boxShadow: "none",  
                            backgroundColor: !isRealtime ? "#6041F9" : "transparent",
                        }}
                        onClick={() => setIsRealtime(false)}
                        variant="contained">AI Messanger</Button>
                </div>
            </div>
            <div className="h-9/12 relative px-4">
                <div 
                    className="h-10/12 w-full pb-20 overflow-y-auto text-xl text-gray-500 font-semibold">
                    {
                        messages.length > 0 ?
                        messages.map((obj, key) => (
                            obj.from == user._id ? 
                            <div
                                key={key} 
                                className='max-w-10/12 min-w-10 p-2 px-6 m-2 rounded-3xl justify-self-end bg-gray-300 overflow-x-auto'>
                                <p className="break-words">{obj.message}</p>
                            </div>:
                            <div
                                key={key}
                                style={{backgroundColor: "#E8E5FF"}}
                                className='max-w-10/12 min-w-10 p-2 px-6 m-2 rounded-3xl justify-self-start bg-gray-300'>
                                <p className="break-words">{obj.message}</p>
                            </div>                   
                        )) : !user._id ?
                        Array(5).fill(null).map((_, key) => 
                            <div key={key}>
                                <div 
                                    className="skeleton w-30 p-6 px-6 m-2 rounded-3xl justify-self-end bg-gray-300">
                                    
                                </div>
                                <div 
                                    style={{backgroundColor: "#E8E5FF"}}
                                    className='skeleton w-60 p-6 px-6 m-2 rounded-3xl justify-self-start bg-gray-300'>
                                </div>                                
                            </div>
                        ) :
                        <h1 className="w-full text-center text-3xl text-gray-600 font-bold">Say Hii to your new Connection!</h1>
                    }
                    {
                        conversations[con_id] && conversations[con_id].typingMessage &&
                        <div
                            className='max-w-10/12 min-w-10 p-2 px-6 m-2 rounded-3xl justify-self-start bg-red-400 text-white'>
                            <p className="break-words">{conversations[con_id].typingMessage }</p>
                        </div>
                    } 
                    <div ref={endRef} className="w-full"></div>
                </div>
                <ChatInput connectionId={connectionId} isRealtime={isRealtime} messages={messages.length > 5 ? messages.slice(messages.length - 5, messages.length): messages}/>
            </div>
        </div>
    );
} 