import { useState } from "react";
import AccountSymbl from "../header/AccountSymbl";
import { useSelector } from "react-redux";
import {Button} from "@mui/material";


export default function ConnectCard({oUser, requestConnection}){
    const [isRequestd, setIsRequested] = useState(false);
    const isDarkMood = useSelector(state => state.isDarkMood);
    
    return(
        <div className="w-full flex items-center justify-between">
            <div className="w-8/12 flex">
                <AccountSymbl userName={oUser.userName}/>
                <div className="w-8/12 p-0 overflow-x-auto">
                    {oUser ?
                        <div className="w-full flex flex-col">
                            <h1
                                className={`text-2xl font-bold ${isDarkMood ? "text-red-500" : "text-gray-500"} overflow-x-auto`}
                                >{oUser.userName ? oUser.userName : "unknown"}:
                            </h1>
                            <p className="text-gray-500">{oUser.email}</p>
                        </div> :
                        <div className="skeleton w-full p-4 bg-gray-300 rounded-2xl">
                            ...
                        </div>
                    }      
                </div>
            </div>
            <Button 
                style={{marginLeft: "1rem"}}
                disabled = {isRequestd}
                onClick={() => {requestConnection(oUser._id); setIsRequested(ir => !ir)}}
                variant="outlined"
                color="success"
                > Connect
            </Button>
        </div>
    );
}