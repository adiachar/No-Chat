const express = require("express");
const app = express();
const {Server} = require("socket.io");
const cors = require("cors");
const userRouter = require("./router/userRouter.js");
const dataRouter = require("./router/dataRouter.js");
const connectionRouter = require("./router/connectionRouter.js");
const mongoose = require("mongoose");
const session = require("express-session");
const http = require("http");
const {onlineUsers} = require("./onlineUsers.js");
const dotenv = require("dotenv");
dotenv.config();

const main = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);       
        console.log("connected to MongoDB Atlas!");
    }catch(error){
        console.error("error connecting to MongoDB:", error);
    }
}
main();

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://192.168.81.22:5173",
        "https://nochatapp-yx0c.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(session({
    secret: "superSecret%$",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 3600000, sameSite: "none" },
}));

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/connection", connectionRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173", 
            "http://192.168.81.22:5173",
            "https://nochatapp-yx0c.onrender.com"],       
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) =>{
    //user register
    socket.on("register", (user) => {
        onlineUsers.set(user._id, socket.id);
    });    

    //user disconnect
    socket.on("disconnect", (user) => {
        onlineUsers.delete(user._id);
    });

    //sending messages
    socket.on("message", (message) =>{
        let socketId = onlineUsers.get(message.to);
        io.to(socketId).emit("response", message);
    });

    //sending end connection message
    socket.on("endConnection", (connectionDtl) => {
        socket.broadcast.emit("endConnection", connectionDtl);
    });
});

server.listen(5000, '0.0.0.0', () =>{
    console.log("...");
});