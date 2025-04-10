import { useSelector } from "react-redux";
import "./AccountSymbl.css";


export default function AccountSymbl({userName, isOnline}){
    const symbol = userName ? userName[0] : "A";
    const isDarkMood = useSelector(state => state.isDarkMood);

    return(
        <div className={`AccountSymbl ${isOnline && "online"}`}
        style={isDarkMood ? {backgroundColor: "white"} : {}}>
            <h1 style={isDarkMood ? {color: "red"} : {}}>{symbol[0]}</h1>
        </div>
    );
}