import { useSelector } from "react-redux";

export default function AccountSymbl({userName, isOnline}){
    const symbol = userName ? userName.toUpperCase()[0] : "A";
    const isDarkMood = useSelector(state => state.isDarkMood);
    return(
        <div 
            className={`h-17 w-17 mr-4 rounded-full bg-gray-700 flex items-center justify-center`}
            style={{backgroundColor: isDarkMood ? "white" : "", border: isOnline ? "7px solid #228B22" : "7px solid transparent"}}>
            <h1 className={`text-3xl font-bold ${isDarkMood ? "text-red-500" : "text-gray-200"}`}>{symbol[0]}</h1>
        </div>
    );
}