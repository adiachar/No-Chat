import AccountSymbl from "../header/AccountSymbl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function ChatCard({user}){
    const navigate = useNavigate();
    const isDarkMood = useSelector(state => state.isDarkMood);
    
    return(
        <div className="w-full flex items-center" onClick={() => navigate("/chat", {state: user._id})}>
            <AccountSymbl userName={user.userName} isOnline={user.isOnline}/>
            <div className="w-9/12 p-0">
                {user ?
                    <div className="w-full flex flex-col">
                        <h1
                            className={`text-2xl font-bold ${isDarkMood ? "text-red-500" : "text-gray-500"} overflow-x-auto`}
                            >{user.userName ? user.userName : "unknown"}:
                        </h1>
                        <p className="text-gray-500">last message</p>
                    </div> :
                    <div className="skeleton w-full p-4 bg-gray-300 rounded-2xl">
                        ...
                    </div>
                }      
            </div>
        </div>
    );
}