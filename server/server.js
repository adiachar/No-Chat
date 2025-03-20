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
const MongoStore = require("connect-mongo");

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

// CORS configuration
app.use(cors({
    origin: "https://nochat-iqi1.onrender.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Session configuration
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60,
    }),
    secret: process.env.SESSION_SECRET || "superSecret%$",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "None",
        path: "/"
    },
    name: 'sessionId'
}));

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/connection", connectionRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://nochat-iqi1.onrender.com", 
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
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