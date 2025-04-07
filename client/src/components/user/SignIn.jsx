import { useFormik } from "formik";
import axios from "axios";
import { setUser } from "../../features/NoChatApp/noChatAppSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./Signing.css";

const socket = io(`http://localhost:5000`);

const client = axios.create({
    baseURL: "http://localhost:5000/user"
});

export default function SignIn(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState(""); 
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
                const response = await client.post(`/signIn`, values);

                if(response.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    dispatch(setUser(response.data.user));
                    socket.emit("register", {_id: response.data.user._id});
                    navigate('/');  

                } else {
                    setStatus(response.data.message);
                }   

            } catch(err) {
                console.log(err);
                setStatus("Internal Server Error!");
            }

        }
    });

    const handlechange = (e) =>{
        e.target.value = e.target.value.trim();
        formik.handleChange(e);
    }

    return(
        <div className="Sign">
            <h1>SignIn</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="input-div">
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" placeholder="Email" value={formik.values.email} onChange={handlechange}/>
                </div>
                <div className="input-div">
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={handlechange}/>
                </div>
                <button type="submit">SignIn</button>
                {status ? <p className="status">{status}</p> : null}
            </form>
            <p className="signUp-nav">Don't have an Account ? <Link to={"/SignUp"}>Click here to sign up</Link></p>
        </div>
    );
}