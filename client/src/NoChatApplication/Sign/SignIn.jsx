import { useFormik } from "formik";
import axios from "axios";
import { setUser } from "../../features/NoChatApp/noChatAppSlice";
import "./SignUp.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io(`http://192.168.37.22:5000`);


export default function SignIn(){
    const ip = useSelector((state) => state.ip);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useState("");
    const initialValues = {
        email: "",
        password: "",
    }

    const formik = useFormik({
        initialValues,
        validate: () => { //No validation for now
            },
        onSubmit: (values) =>{
            axios.post(`http://${ip}:5000/user/signIn`, values, {withCredentials: true})
            .then((res) => {
                if(res.data.user){
                    let user = res.data.user;
                    socket.emit("register", {_id: user._id});
                    dispatch(setUser(user));
                    navigate("/");
                } else {
                    setLoginStatus(res.data);
                }
            });
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
                {loginStatus ? <p className="status">{loginStatus}</p> : null}
            </form>
            <p className="signUp-nav">Don't have an Account ? <Link to={"/SignUp"}>Click here to sign up</Link></p>
        </div>
    );
}