import {useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../features/NoChatApp/noChatAppSlice";
import "./ChatInput.css";
import { useState } from "react";
import InputEmoji from "react-input-emoji";
import axios from "axios";

export default function ChatInput({connectionId, updateChat}){
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const headers = useSelector(state => state.headers);

    function handleChange(value){
        if(value != " "){
            dispatch(sendMessage({msg: value, to: connectionId}));
            setInput(value);
        }
    }

    const leaveMessage = async () => {
        if(input && input != " ") {
            try {
                let response = await axios.post(`https://nochat.onrender.com/data/store-message`, {to_id: connectionId, message: input}, {headers});
                if(response.status === 200) {
                    setInput("");
                    updateChat();

                }            
            } catch(err) {
                console.log(err);
            }

        } else {
            setInput("");
        }
    }

    return(
        <div className="ChatInput">
            <p>You:</p>
            <div className="input">
                <InputEmoji 
                value={input} 
                placeholder="your message..." 
                onChange={handleChange} 
                multiline 
                style={{fontWeight: "900"}}/>           
            </div>
            <button onClick={() => leaveMessage()}>Leave & clear</button>
        </div>
    );
}