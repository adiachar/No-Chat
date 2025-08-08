import React from 'react';
import {useSelector} from "react-redux";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Account() {
    const user = useSelector(state => state.user);
    const isDarkMood = useSelector(state => state.isDarkMood);

    return (
        <div className="mb-4 p-3 rounded-xl bg-gray-200 flex" style={isDarkMood ? {backgroundColor: "white"}: {}}>
            <AccountCircleIcon 
            className="mr-5"
            style={ {color: isDarkMood ? "gray" : "", fontSize: "4rem"}}/>
            <div className="flex flex-col justify-center">
                <h2>Name: {user.userName}</h2>
                <h2>Email: {user.email}</h2>                
            </div>
        </div>
    )
}
