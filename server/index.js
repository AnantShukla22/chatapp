const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors')

const app = express();
const port = 4500 || process.env.PORT // it means the port from which the req is generated or default 4500

let users = [{}];

app.use(cors());
app.get("/", (req, res) => {
    res.send("hello its working")
})

const server = http.createServer(app) // tocreate server
const io = socketIO(server);

// when there is a new collectionn io.on reflects, socket is a parameter
io.on("connection", (socket) => {
    console.log("New Connection established")

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        // when someone joins
        console.log(`${user} has joined`)

        // when some new person jins
        socket.broadcast.emit('userJoined', { user: "admin", message: `${users[socket.id]} has joined` }) // this goes to all the already existing members 

          //here this msg will only goes to u that u joined
        socket.emit('welcome', { user: "admin", message: `welcome to the chat,${users[socket.id]}` })
    })

    // when someone typr a message
    socket.on('message',({message,id})=>{
        // since socket.emit and braodcast is not reasonable we will emit to the whole circit ie io
        io.emit('sendMessage',{user:users[id],message,id}) 
    })
    // wehn we get the disconnect msg we reply user left
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: 'admin', message: `${users[socket.id]} has left` })
        console.log("user left")

    })

})

server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`)
})