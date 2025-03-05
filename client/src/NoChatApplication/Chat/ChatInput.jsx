import {useDispatch, useSelector } from "react-redux";
import { sendMessage, clearMessage } from "../../features/NoChatApp/noChatAppSlice";
import "./ChatInput.css";
import { useState } from "react";
import axios from "axios";

export default function ChatInput({connectionId, updateChat}){
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const user = useSelector((state) => state.user);
    const ip = useSelector(state => state.ip);
    function handleChange(e){
        if(e.target.value != " "){
            let value = e.target.value;
            dispatch(sendMessage({msg: value, to: connectionId}));
            setInput(value);
        }
    }

    function leaveMessage(){
        if(input && input != " "){
            axios.post(`http://${ip}:5000/data/storeMessage`, {from: user._id, to: connectionId, message: input})
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
            <textarea type="text" value={input} rows = "1" onChange={handleChange}/>
            <button onClick={() => leaveMessage()}>Leave & clear</button>
        </div>
    );
}