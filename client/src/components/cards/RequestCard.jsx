import AccountSymbl from "../header/AccountSymbl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import {Button} from "@mui/material";


export default function RequestCard({request, acceptRequest, rejectRequest}){
    const navigate = useNavigate();
    const [isRejected, setIsRequested] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const isDarkMood = useSelector(state => state.isDarkMood);
    
    return(
        <div className="w-full pb-2 flex items-center border-b-2 border-gray-300">
            <AccountSymbl userName={request.userName} isOnline={false}/>
            <div className="w-6/12 p-0 overflow-x-auto">
                {request ?
                    <div className="w-full flex flex-col">
                        <h1
                            className={`text-2xl font-bold ${isDarkMood ? "text-red-500" : "text-gray-500"} overflow-x-auto`}
                            >{request.userName ? request.userName : "unknown"}:
                        </h1>
                        <p className="text-gray-500">{request.email}</p>
                    </div> :
                    <div className="skeleton w-full p-4 bg-gray-300 rounded-2xl">
                        ...
                    </div>
                }      
            </div>
            <div className="flex flex-col gap-4">
                <Button 
                    style={{marginLeft: "1rem"}}
                    disabled = {isAccepted || isRejected}
                    onClick={() => {acceptRequest(request._id); setIsAccepted(ia => !ia)}}
                    variant="outlined"
                    color="success"
                    > Accept
                </Button>
                <Button 
                    style={{marginLeft: "1rem"}}
                    disabled = {isAccepted || isRejected}
                    onClick={() => {rejectRequest(request._id); setIsRequested(ir => !ir)}}
                    variant="outlined"
                    color="error"
                    > Reject
                </Button>                
            </div>
        </div>
    );
}