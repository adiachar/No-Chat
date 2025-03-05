import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { setUser } from "../../features/NoChatApp/noChatAppSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import "./SignUp.css";

const socket = io(`http://192.168.37.22:5000`);


export default function SignUp(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ip = useSelector(state => state.ip);
    const [error, setError] = useState("");
    const initialValues = {
        userName: "",
        dob: 0,
        email: "",
        password: "",
        confirmPassword: "",
    }

    const formik = useFormik({
        initialValues,
        validate: () => { //No validation for now
            },
        onSubmit: (values) =>{
            if(formik.values.confirmPassword === formik.values.password){
                setError("");
                axios.post(`http://${ip}:5000/user/signUp`, {values}, {withCredentials: true})
                .then((res) =>{
                    if(res.data.user){
                        let user = res.data.user;
                        socket.emit("register", {_id: user._id});
                        dispatch(setUser(user));
                        navigate("/");
                    }else{
                        console.log("Did not get user data from server");
                    }
                }).catch((err) => {
                    if(err.response.data.message){
                        setError(err.response.data.message);
                    }
                });
            }else{
                setError("Please check the password...");
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
                {error ? <p>{error}</p> : null}
                <button type="submit">SignUp</button>
            </form>
        </div>
    );
}