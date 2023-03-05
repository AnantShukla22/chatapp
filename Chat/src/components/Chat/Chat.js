import React, { useEffect, useState } from 'react'
import { user } from '../Join/Join'
import socketIO from "socket.io-client"
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from '../Message/Message';
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

const ENDPOINT = "http://localhost:4500/";
let socket;

const Chat = () => {

  const [id, setid] = useState("");
  const [messages, setMessages] = useState([])


  const send = () => {
    const message = document.getElementById('chatInput').value;
    socket.emit('message', { message, id });
    document.getElementById('chatInput').value = "";
  }

  // when the button is clicked in app.js the Chat.js file is used and all these codes in it starts, and thus the server starts to connect to the server

  // useEffect is used as if there is a change we will change [socket] 
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ['websocket'] })
    // it means socketIO has connected to the endpoint
    socket.on('connect', () => {
      alert("Connected to server")
      setid(socket.id);

    })

    socket.emit('joined', { user }) // emit means we r sending omething(an object here user: user) to backed with same 'joined' keyword

    socket.on('welcome', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message)
    })

    socket.on('userJoined', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    })

    socket.on('leave', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message)
    })
    return () => {
      socket.emit('disconnet')  // it means when we return we disconnect the socket
      socket.off();
    }
  }, [])


  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    })
    return () => {
      socket.off();
    }
  }, [messages])

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>C CHAT</h2>
          {/* when we click it we go to previous page */}
          <a href="/"> <img src={closeIcon} alt="Close" /></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => <Message user={item.id === id ? '' : item.user} message={item.message} classs={item.id === id ? 'right' : 'left'} />)}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input onKeyPress={(event)=>event.key==="Enter" ? send(): null} type="text" id="chatInput" />
          <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
        </div>
      </div>
    </div>
  )
}

export default Chat