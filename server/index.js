const express = require("express");
const app = express();
const {Server} = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./router/userRouter.js");
const dataRouter = require("./router/dataRouter.js");
const connectionRouter = require("./router/connectionRouter.js");
const mongoose = require("mongoose");
const session = require("express-session");
const http = require("http");
const {onlineUsers} = require("./onlineUsers.js");
const { authorization } = require("./authorization.js");

const main = async () => {
    await mongoose.connect("mongodb://localhost:27017/noChat");
}

main().then(() => console.log("connected to db"));

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(cors({
    origin: '*',
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
        origin: '*',       
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

app.get("/", authorization, (req, res) => {
    return res.status(201).json({message: "Authorized!", user: req.user});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>{
    console.log("...");
});