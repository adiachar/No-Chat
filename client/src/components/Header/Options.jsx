import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setIsDarkMood } from '../../features/NoChatApp/noChatAppSlice';
import { useDispatch, useSelector } from 'react-redux';
import op from "./Options.module.css";

export default function Options({setShowAccount}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [mood, setMood] = useState("light");
    const isDarkMood = useSelector(state => state.isDarkMood);

    let signOut = () => {
        localStorage.token = "";
        navigate("/sign-in");
    }

    return (
        <ul className={op.options} style={isDarkMood ? {backgroundColor: "#fff2"} : {}}>
            <li className={op.option}>
                <Button variant='contained' 
                className={op.btn} 
                onClick={() => setShowAccount(sa => !sa)}
                style={isDarkMood ? {color: "#fff9"} : {color: "black"}}
                >Account</Button>
            </li>
            <li className={op.option}>
                <Button variant='contained' 
                className={op.btn} 
                onClick={() => signOut()}
                style={isDarkMood ? {color: "#fff9"} : {color: "black"}}
                >Sign Out</Button>
            </li>
            <li className={op.option}>
                <Button variant='contained' 
                className={op.btn} 
                onClick={() =>{setMood(mood => mood === 'dark' ? 'light' : 'dark'); dispatch(setIsDarkMood())}}
                style={isDarkMood ? {color: "#fff9"} : {color: "black"}}
                >{mood} Mood</Button>
            </li>
        </ul>
    );
}
