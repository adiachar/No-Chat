import {useDispatch, useSelector } from "react-redux";
import { sendMessage, sendTypingMessage, updateMessage } from "../../features/NoChatApp/noChatAppSlice";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { Button, Fab } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import SendIcon from '@mui/icons-material/ArrowUpward';
import Smile from '@mui/icons-material/SentimentSatisfiedAlt';
import { darken } from "@mui/material";

const tones = [
    {tone: "casual", color: "#616161"}, 
    {tone: "friendly", color: "#2E7D32"}, 
    {tone: "excited", color: "#EF6C00"}, 
    {tone: "formal", color: "#1E3A8A"},
    {tone: "romantic", color: "#C2185B"}, 
    {tone: "sarcastic", color: "#F9A825"}, 
    {tone: "encouraging", color: "#2E7D32"}, 
    {tone: "Urgent", color: "#C62828"},
    {tone: "mysterious", color: "#4527A0"}
]


export default function ChatInput({connectionId, messages, isRealtime}){
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const headers = useSelector(state => state.headers);
    const user = useSelector(state => state.user);
    const connections = useSelector(state => state.connections);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [tone, setTone] = useState(tones[0].tone);
    
    function handleChange(value){
        if(value == " ") {
            return;
        }

        if(isRealtime) {
            dispatch(sendTypingMessage({from: user._id, to: connectionId, message: value}));       
        }
        if(isGenerating) {
            setIsGenerating(false);
        }
        setInput(value);
    }

    function onEmojiClick(emojiObject) {
        setInput(inp => inp + emojiObject.emoji);
        setShowEmojiPicker(semp => !semp);
    }

    const leaveMessage = async () => {
        setIsGenerating(false);
        if(input.trim()) {
            try {
                const message = input;
                setInput("");
                dispatch(sendMessage({from: user._id, to: connectionId, message: message}));
                dispatch((updateMessage({from: user._id, to: connectionId, message: message})));
                let response = await axios.post(`https://nochat.onrender.com/data/store-message`, {to_id: connectionId, message: message}, {headers});  

            } catch(err) {
                console.log(err);
            }

        } else {
            setInput("");
        }
    }

    const generateText = async () => {

        if(input.trim()) {
            setIsGenerating(true);
            try {
                let response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ai/generate-message`, 
                    {currUserName: user.userName, toUserName: connections[connectionId].userName, messages: messages, tone: tone, request: input}, 
                    {headers});

                if(response.status == 200) {
                    setInput(response.data.message);
                    setIsGenerating(false);
                }
            } catch (err) {
                setInput(err);
            }
        }
    }

    const btnStyle = {height: "2rem", minWidth: "auto", margin: "0.4rem", borderRadius: "1rem"}

    return(
        <div className="w-full pb-4 px-4 absolute bottom-0 left-0 bg-white border-2 border-transparent rounded-t-2xl flex flex-col items-center" >
            {showEmojiPicker && <EmojiPicker className="" onEmojiClick={onEmojiClick} />}
            <div className="w-full lg:w-1/2 m-0 flex flex-col gap-2">
                <div className="w-full flex">
                    <Fab
                        style={{height: "50px",width: "60px",padding: "0px", boxShadow: "none", backgroundColor: "transparent"}} 
                        onClick={() => setShowEmojiPicker(semp => !semp)}
                        ><Smile style={{fontSize: "3rem", fontWeight: "900", color: "gray"}}/>
                    </Fab>       
                    {!isRealtime && <div className="w-full flex overflow-x-auto px-3">
                       {tones.map((obj, idx) => 
                            <Button
                                key={idx}
                                variant="contained"
                                // style={{
                                //     ...btnStyle, 
                                //     backgroundColor: obj.color,  
                                //     transform: obj.tone == tone ? "scale(1.1)" : "none"
                                // }}
                                sx={{
                                    ...btnStyle,
                                    backgroundColor: obj.color,
                                    border: tone == obj.tone ? `5px solid ${darken(obj.color, 0.2)}` : "5px solid transparent",
                                    transform: obj.tone == tone ? "scale(1.1)" : "none",
                                    '&:hover': {backgroundColor: darken(obj.color, 0.1)}}}
                                onClick={() => setTone(obj.tone)}
                                >
                                    {obj.tone}
                            </Button>
                        )}
                    </div>}       
                </div>

                <div className="p-1 flex items-center gap-2 border-4 border-gray-700 rounded-2xl">
                    <textarea 
                        style={{fontSize: "1rem"}}
                        className="w-full p-1 font-bold text-gray-600 outline-0  rounded-2xl"
                        value={input} 
                        placeholder="your message..." 
                        onChange={(e) => handleChange(e.target.value)} 
                        />
                    {!isRealtime && 
                    <Button 
                        style={{height: "3rem", margin: "0px", display: "block", color: "white", boxShadow: "none", backgroundColor: "#6041F9", borderRadius: "1rem"}}
                        variant="contained"
                        onClick={() => generateText()}>
                            {isGenerating ? <RotateLeftIcon className="loading"/> : <AutoAwesomeIcon />}
                    </Button>}      
                    <Button 
                        size="small"
                        style={{
                            height: "3rem",
                            margin: "0px",
                            padding: "0px", 
                            display: "block", 
                            color: "white", 
                            boxShadow: "none", 
                            backgroundColor: "#228B22", 
                            borderRadius: "1rem"
                        }}
                        variant="outlined" 
                        onClick={() => leaveMessage()}>
                            <SendIcon style={{fontSize: "2rem"}}/>
                    </Button>                    
                </div>
            </div>
        </div>
    );
}