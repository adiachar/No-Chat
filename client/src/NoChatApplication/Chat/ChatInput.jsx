import {useDispatch, useSelector } from "react-redux";
import { sendMessage, clearMessage } from "../../features/NoChatApp/noChatAppSlice";
import "./ChatInput.css";
import { useState } from "react";
import InputEmoji from "react-input-emoji";
import axios from "axios";

export default function ChatInput({connectionId, updateChat}){
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const user = useSelector((state) => state.user);

    function handleChange(value){
        if(value != " "){
            dispatch(sendMessage({msg: value, to: connectionId}));
            setInput(value);
        }
    }

    function leaveMessage(){
        if(input && input != " "){
            axios.post(`https://nochat.onrender.com/data/storeMessage`, {from: user._id, to: connectionId, message: input})
            .then((res) => {
                if(res.data.success){
                    setInput("");
                    updateChat();
                }
            }).catch((err) => {
                console.log("error while storing message in chatInput.jsx");
                console.log(err);
            });
        }else{
            setInput("");
        }
    }

    return(
        <div className="ChatInput">
            <p>You:</p>
            <div className="input">
                <InputEmoji value={input} placeholder="your message..." onChange={handleChange} 
                multiline 
                style={{fontWeight: "900"}}/>           
            </div>
            <button onClick={() => leaveMessage()}>Leave & clear</button>
        </div>
    );
}