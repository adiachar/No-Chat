import "./AccountSymbl.css";
export default function AccountSymbl({userName, isOnline}){
    const symbol = userName ? userName[0] : "A";

    return(
        <div className={`AccountSymbl ${isOnline && "online"}`}>
            <h1>{symbol[0]}</h1>
        </div>
    );
}