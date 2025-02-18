import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ChatMessage.css";
import AccountSymbl from "../Header/AccountSymbl";
import { useSelector } from "react-redux";

export default function ChatMessage({connection}){
    const headingRef = useRef(null);
    const containerRef = useRef(null);
    const [fontSize, setFontSize] = useState(40);

    useEffect(() => {

        const adjustFontSize = () => {
            if(!headingRef.current || !containerRef.current)
                return;
            let newFontSize = 30;
            headingRef.current.style.fontSize = `${newFontSize}px`;
            while(headingRef.current.scrollWidth > containerRef.current.clientWidth 
                || headingRef.current.scrollHeight > containerRef.current.clientHeight && newFontSize > 10){
                newFontSize--;
                headingRef.current.style.fontSize = `${newFontSize}px`;
            }
            setFontSize(newFontSize);
        };
        adjustFontSize();
        window.addEventListener("resize", adjustFontSize);
    }, []);
    
    return(
        <div className={`ChatMessage`} ref={containerRef}>
            <div className="toUser">
                <AccountSymbl userName={connection ? connection.userName : "A"} isOnline={connection.isOnline}/>
                <p>{connection ? connection.userName : "unknown"}</p>
            </div>
            <div className="h1">
                <h1 ref={headingRef}>{connection ? connection.msg : "..."}</h1>
            </div>
        </div>
    );
}