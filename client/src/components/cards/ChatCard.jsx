import AccountSymbl from "../header/AccountSymbl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


export default function ChatCard({oUser}){
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const isDarkMood = useSelector(state => state.isDarkMood);
    const conversations = useSelector(state => state.conversations);
    const con_id = [user?._id, oUser?._id].sort().join("_");

    const [lastMessage, setLastMessage] = useState("...");
    const [typingMessage, setTypingMessage] = useState("");

    useEffect(() => {
        if(conversations[con_id]) {
            setTypingMessage(conversations[con_id].typingMessage);
            let messageLength = conversations[con_id].messages.length;
            setLastMessage(messageLength > 0 ? conversations[con_id].messages[messageLength - 1].message : "Say hello to your new connection");
        }
    },[conversations]);

    
    return(
        <div className="w-full flex items-center" onClick={() => navigate("/chat", {state: oUser._id})}>
            <AccountSymbl userName={oUser?.userName || ""} isOnline={oUser?.isOnline || false}/>
            <div className="w-9/12 p-0">
                {oUser ?
                    <div className="w-full flex flex-col">
                        <h1
                            className={`text-2xl font-bold ${isDarkMood ? "text-red-500" : "text-gray-500"} overflow-x-auto`}
                            >{oUser.userName ? oUser.userName : "unknown"}:
                        </h1>

                        <div className="flex">
                            {typingMessage ? (
                                <p className="px-4 bg-red-400 text-lg text-white rounded-full">{typingMessage.length > 20 ? typingMessage.slice(0, 20) +"..." : typingMessage}</p>

                            ): <p className="text-gray-500">{lastMessage.length > 20 ? lastMessage.slice(0, 20) +"..." : lastMessage}</p>}
                        </div>

                    </div> :
                    <div className="skeleton w-full p-4 bg-gray-300 rounded-2xl">
                        ...
                    </div>
                }      
            </div>
        </div>
    );
}