import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setIsDarkMood } from '../../features/NoChatApp/noChatAppSlice';
import { useDispatch, useSelector } from 'react-redux';

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
        <ul className="w-full mx-auto mb-4 rounded-full bg-gray-200 flex justify-around" style={isDarkMood ? {backgroundColor: "#fff2"} : {}}>
            <li className="flex items-center">
                <Button variant='text' 
                onClick={() => setShowAccount(sa => !sa)}
                style={{padding:"0.8rem", color: isDarkMood ? "#fff9" : "gray", borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem"}}
                >Account</Button>
            </li>
            <li className="">
                <Button variant='text' 
                onClick={() => signOut()}
                style={{padding:"0.8rem", color: isDarkMood ? "#fff9" : "gray"}}
                >Sign Out</Button>
            </li>
            <li className="">
                <Button variant='text' 
                onClick={() =>{setMood(mood => mood === 'dark' ? 'light' : 'dark'); dispatch(setIsDarkMood())}}
                style={{width: "100%", padding:"0.8rem", color: isDarkMood ? "#fff9" : "gray", borderTopRightRadius: "2rem", borderBottomRightRadius: "2rem"}}
                >{mood} Mood</Button>
            </li>
        </ul>
    );
}
