import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MessageCard from "../AllMessages/MessageCard";

let ip = "192.168.37.22";
let hStyle = {width: "100%", marginTop: "2rem", textAlign: "center", color: "rgba(0, 0, 0, 0.464)"};
export default function MakeConnections(){
    const [allUsers, setAllUsers] = useState([]);
    const user = useSelector((state) => state.user);
    let AllConnections = useSelector((state) => state.connections);
    const ip = useSelector(state => state.ip);
    useEffect(() => {
        axios.get(`http://${ip}:5000/data/allUsers`)
        .then((res) => {
            let AllUsers = res.data;
            let oUsers = [];
            for(let oUser of AllUsers){
                let isConnection = false;
                for(let connec of AllConnections){
                    if(oUser._id == connec._id){
                        isConnection = true;
                    }
                }
                if(!isConnection){
                    oUsers.push(oUser);
                }
            }
            setAllUsers(oUsers);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    function requestConnection(_id){
        axios.post(`http://${ip}:5000/connection`, {from: user._id, to: _id})
        .then((res) => {
            if(res.data == "success"){
                console.log("request made");
            }else{
                console.log(res.data);
            }
        }).catch((err) => {
            console.log("error: " +err);
        });
    }

    return (
        <div className="MakeConnections">
            <div className="user">
                {allUsers.length == 1 ? (<h1 style={hStyle}>No Users Here!</h1>) : allUsers.map((oUser, idx) => { 
                    return ( oUser.email !== user.email ? 
                    ( <div className="user" key={idx}>
                        <MessageCard connection={oUser} btn1={requestConnection} />
                    </div> ) : null) }
                )} 
            </div>
        </div>
    );
}