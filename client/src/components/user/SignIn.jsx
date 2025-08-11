import { useFormik } from "formik";
import axios from "axios";
import { setUser, setHeaders, setConnectionRequests, setConnections} from "../../features/NoChatApp/noChatAppSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Button } from "@mui/material";

const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

const client = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/user`
});

export default function SignIn(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const initialValues = {
        email: "",
        password: "",
    }

    const formik = useFormik({
        initialValues,

        validate: () => { //No validation for now
            },
        
        onSubmit: async (values) => {
            try{
                setIsSubmitted(true);
                const response = await client.post(`/signIn`, values);
                setIsSubmitted(false);
                if(response.status === 200) {

                    localStorage.setItem("token", response.data.token);

                    dispatch(setUser(response.data.user));
                    dispatch(setHeaders(response.data.token));
                    dispatch(setConnections(response.data.user.connections));
                    dispatch(setConnectionRequests(response.data.user.connectionRequests));
                    socket.emit("register", {_id: response.data.user._id});
                    navigate('/');  

                } else {
                    setStatus(response.data.message);
                }   

            } catch(err) {
                setIsSubmitted(false); 
                setStatus(err.response ? err.response.data.message : "Internal Server Error!");
            }
        }
    });

    const handlechange = (e) =>{
        e.target.value = e.target.value.trim();
        formik.handleChange(e);
    }

    return(
        <div className="h-full w-full p-10">
            <h1 className="mt-6 text-3xl font-bold text-indigo-600">NoChat</h1>
            <p className="mt-2 text-gray-500 font-semibold">A New way of Chating</p>
            <div className="lg:h-8/12 md:h-8/12 lg:w-8/12 p-6 mt-10 mx-auto border-3 border-gray-400 rounded-3xl flex gap-10">
                <div 
                    style={{background: "linear-gradient(190deg, black 10%, #6041F9)"}}
                    className="w-full h-full p-6 hidden lg:flex md:flex rounded-2xl items-center justify-center">
                        <h1 className="text-center text-white text-3xl font-bold">Welcome! Join Now to start a new way of Chating</h1>
                </div>
                <div className="w-80 h-full flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-600">Sign in</h1>
                    <p className="mt-2 mb-4 text-gray-400 text-xs font-medium">Please fill sign in details to continue using this app</p>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col">
                        <input className="w-full p-3 mt-4 rounded-2xl bg-gray-200" type="email" id="email" name="email" placeholder="Email" value={formik.values.email} onChange={handlechange}/>
                        <input className="w-full p-3 mt-4 mb-5 rounded-2xl bg-gray-200" type="password" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={handlechange}/>
                        <Button 
                            loading={isSubmitted}
                            style={{padding: "0.1rem", textTransform: "lowercase", backgroundColor: "#6041F9", borderRadius: "0.8rem", fontSize: "1.5rem", fontWeight: "700"}}
                            variant="contained"
                            type="submit">Sign in</Button>
                        {status ? <p className="mt-4 text-xs font-medium text-center text-red-600">{status}</p> : null}
                    </form>
                    <p className="mt-4 text-gray-400 text-xs font-medium">Don't have an Account ? <Link to={"/sign-up"} className="text-indigo-600 underline">Click here to sign up</Link></p>
                </div>
            </div>
        </div>
    );
}