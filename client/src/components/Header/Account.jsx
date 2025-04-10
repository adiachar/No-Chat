import React from 'react';
import {useSelector} from "react-redux";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ac from "./Account.module.css";

export default function Account() {
    const user = useSelector(state => state.user);
    const isDarkMood = useSelector(state => state.isDarkMood);

    return (
        <div className={ac.Account} style={isDarkMood ? {backgroundColor: "white"}: {}}>
            <AccountCircleIcon 
            className={ac.accountIcon}
            style={isDarkMood ? {color: "black"}: {}}/>
            <div className={ac.info}>
                <h2>Name: {user.userName}</h2>
                <h2>Email: {user.email}</h2>                
            </div>
        </div>
    )
}
