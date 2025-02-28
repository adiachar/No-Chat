import {useDispatch, useSelector } from "react-redux";
import { sendMessage, clearMessage } from "../../features/NoChatApp/noChatAppSlice";
import "./ChatInput.css";
import { useState } from "react";

export default function ChatInput({connectionId}){
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const user = useSelector((state) => user);

    function handleChange(e){
        if(e.target.value != " "){
            let value = e.target.value;
            dispatch(sendMessage({msg: value, to: connectionId}));
            setInput(value);
        }
    }

    function leaveMessage(){
        axios.post("http://192.168.15.176:5000/data/storeMessage", {from: user._id, to: connectionId, message: input})
        .then((res) => {
            if(res.data.success){
                setInput("");
            }
        }).catch((err) => {
            console.log("error while storing message in chatInput.jsx");
            console.log(err);
        });
    }

    return(
        <div className="ChatInput">
            <p>You:</p>
            <textarea type="text" value={input} rows = "1" onChange={handleChange}/>
            <button onClick={() => leaveMessage()}>Leave & clear</button>
        </div>
    );
}