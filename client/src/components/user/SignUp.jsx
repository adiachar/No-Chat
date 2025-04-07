import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { setConnectionRequests, setConnections, setUser } from "../../features/NoChatApp/noChatAppSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import "./Signing.css";

const socket = io(`http://localhost:5000`);

const client = axios.create({
    baseURL: "http://localhost:5000/user"
});

export default function SignUp(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState("");
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
                    const response = await client.post(`/signUp`, values);

                    if(response.status === 200) {
                        localStorage.setItem("token", response.data.token);
                        
                        const user = {
                            _id: response.data.user._id,
                            userName: response.data.user.userName,
                            email: response.data.user.email
                        }

                        dispatch(setUser(user));
                        dispatch(setConnections(response.data.user.connections));
                        dispatch(setConnectionRequests(response.data.user.connectionRequests));
                        socket.emit("register", {_id: response.data.user._id});
                        navigate('/');

                    } else {
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
        <div className="Sign">
            <h1>SignUp</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="input-div">
                    <label htmlFor="userName">Name: </label>
                    <input type="text" id="userName" placeholder="Name" name="userName" value={formik.values.userName} onChange={handlechange}/>
                </div>
                <div className="input-div">
                    <label htmlFor="dob">Date Of Birth: </label>
                    <input type="date" id="dob" name="dob" placeholder="" value={formik.values.dob} onChange={handlechange}/>   
                </div>
                <div className="input-div">
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" placeholder="Email" value={formik.values.email} onChange={handlechange}/>
                </div>
                <div className="input-div">
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={handlechange}/>
                </div>
                <div className="input-div">
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input type="text" id="confirmPassword" name="confirmPassword" placeholder="Congirm Password" value={formik.values.confirmPassword} onChange={handlechange}/>
                </div>
                {status ? <p>{status}</p> : null}
                <button type="submit">SignUp</button>
            </form>
        </div>
    );
}