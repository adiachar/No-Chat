import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { setConnectionRequests, setConnections, setHeaders, setUser } from "../../features/NoChatApp/noChatAppSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { Button } from "@mui/material";

const socket = io(import.meta.env.VITE_WEB_SOCKET_URL);

const client = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/user`
});

export default function SignUp(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const initialValues = {
        userName: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    const formik = useFormik({
        initialValues,

        validate: () => { //No validation for now
            },

        onSubmit: async (values) => {
            if(formik.values.confirmPassword === formik.values.password) {
                try{
                    setIsSubmitted(true);
                    const response = await client.post(`/signUp`, values);
                    setIsSubmitted(false);
                    if(response.status === 200) {
                        localStorage.setItem("token", response.data.token);
                        
                        const user = {
                            _id: response.data.user._id,
                            userName: response.data.user.userName,
                            email: response.data.user.email
                        }

                        dispatch(setUser(user));
                        dispatch(setHeaders(response.data.token));
                        dispatch(setConnections(response.data.user.connections));
                        dispatch(setConnectionRequests(response.data.user.connectionRequests));
                        socket.emit("register", {_id: response.data.user._id});
                        navigate('/');

                    } else {
                        setIsSubmitted(false);
                        setStatus(response.data.message);
                    }
                } catch(err) {
                    console.log(err);
                    setStatus("Internal Server Error!");
                }
                
            } else {
                setStatus("Please check the password!");
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
            <div className="lg:h-10/12 md:h-10/12 lg:w-8/12 p-6 mt-6 mx-auto border-3 border-gray-400 rounded-3xl flex gap-10">
                <div 
                    style={{background: "linear-gradient(190deg, black 20%, blue, indigo)"}}
                    className="w-full h-full p-6 hidden lg:flex md:flex rounded-2xl items-center justify-center">
                        <h1 className="text-center text-white text-3xl font-bold">Welcome! Join Now to start a new way of Chating</h1>
                </div>
                <div className="w-90 h-full flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-600">Sign up</h1>
                    <p className="mt-2 mb-2 text-gray-400 text-xs font-medium">Please fill sign up details to continue using this app</p>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col">    
                        <input className="w-full p-2 mt-4 rounded-2xl bg-gray-200" type="text" id="userName" placeholder="Name" name="userName" value={formik.values.userName} onChange={handlechange} required/>
                        <input className="w-full p-2 mt-4 rounded-2xl bg-gray-200" type="date" id="dob" name="dob" placeholder="" value={formik.values.dob} onChange={handlechange} required/>   
                        <input className="w-full p-2 mt-4 rounded-2xl bg-gray-200" type="email" id="email" name="email" placeholder="Email" value={formik.values.email} onChange={handlechange} required/>
                        <input className="w-full p-2 mt-4 rounded-2xl bg-gray-200" type="password" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={handlechange} required/>
                        <input className="w-full p-2 mt-4 mb-5 rounded-2xl bg-gray-200" type="text" id="confirmPassword" name="confirmPassword" placeholder="Congirm Password" value={formik.values.confirmPassword} onChange={handlechange} required/>
                        <Button
                            loading={isSubmitted}
                            style={{padding: "0.1rem", textTransform: "lowercase", backgroundColor: "#6041F9", borderRadius: "0.8rem", fontSize: "1.5rem", fontWeight: "700"}}
                            variant="contained"
                            type="submit">Sign up</Button>
                        {status ? <p className="mt-2 text-xs font-medium text-center text-red-600">{status}</p> : null}
                    </form>
                    <p className="mt-4 text-gray-400 text-xs font-medium">Don't have an Account ? <Link to={"/sign-in"} className="text-indigo-600 underline">Click here to sign in</Link></p>
                </div>
            </div>
        </div>
    );
}