const express = require("express");
const app = express();
const {Server} = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./router/userRouter.js");
const dataRouter = require("./router/dataRouter.js");
const aiRouter = require("./router/aiRouter.js");
const connectionRouter = require("./router/connectionRouter.js");
const mongoose = require("mongoose");
const http = require("http");
const {onlineUsers} = require("./onlineUsers.js");

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL);
}

app.use(express.urlencoded({extended: true}));
app.use(express.json()); 

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/connection", connectionRouter);
app.use("/ai", aiRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',       
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
    socket.on("message:typing", (message) => {
        let socketId = onlineUsers.get(message.to);
        if(socketId) {
            io.to(socketId).emit("message:typing:update", message);            
        }
    });

    socket.on("message:send", (obj) => {
        let socketId = onlineUsers.get(obj.to);
        if(socketId) {
            io.to(socketId).emit("message:new", obj);
        }
    });

    //sending end connection message
    socket.on("endConnection", (connectionDtl) => {
        socket.broadcast.emit("endConnection", connectionDtl);
    });

});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () =>{
    console.log("Listening to PORT:", PORT);
    main().then(() => console.log("connected to db!")).catch((err) => console.log("cannot connect to db!"));
});