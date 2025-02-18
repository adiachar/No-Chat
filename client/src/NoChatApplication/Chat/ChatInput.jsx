import {useDispatch } from "react-redux";
import { sendMessage, clearMessage } from "../../features/NoChatApp/noChatAppSlice";
import "./ChatInput.css";
import { useState } from "react";

export default function ChatInput({connectionId}){
    const dispatch = useDispatch();
    const [input, setInput] = useState("");

    function handleChange(e){
        if(e.target.value != " "){
            let value = e.target.value;
            dispatch(sendMessage({msg: value, to: connectionId}));
            setInput(value);
        }
    }

    return(
        <div className="ChatInput">
            <p>You:</p>
            <textarea type="text" value={input} rows = "1" onChange={handleChange}/>
            <button onClick={() => setInput("")}>Leave & clear</button>
        </div>
    );
}