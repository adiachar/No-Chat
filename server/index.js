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

const main = async () => {
    await mongoose.connect("mongodb://localhost:27017/noChat");
}

main().then(() => console.log("connected to db"));

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://192.168.180.22:5173", 
        "http://192.168.56.1:5173", 
        "http://192.168.76.22:5173",
        "http://192.168.15.176:5173",
        "http://192.168.97.22:5173",
        "http://192.168.5.22:5173",
        "http://192.168.37.22:5173",
        "http://192.168.96.22:5173"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(session({
    secret: "superSecret%$",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 },
}));

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/connection", connectionRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173", 
            "http://192.168.180.22:5173", 
            "http://192.168.56.1:5173", 
            "http://192.168.76.22:5173",
            "http://192.168.15.176:5173",
            "http://192.168.97.22:5173",
            "http://192.168.5.22:5173",
            "http://192.168.37.22:5173",
            "http://192.168.96.22:5173"],       
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