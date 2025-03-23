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
const url = process.env.MONGODB_URL;

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
        mongoUrl: url,
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

const PORT = process.env.PORT || 8080
server.listen(PORT, () =>{
    console.log("listening to the port", PORT);
    mongoose.connect(url)
    .then(() => console.log("database connected!"))
    .catch(() => console.log("db connection error!"));
});