import React, { useState } from 'react'
import './Join.css'
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom'

// declared here as we have to export
let user
// this functions takes the value input on the input area and then after that we will empty it 
  const sendUser = () => {
     user = document.getElementById('joinInput').value
     document.getElementById('joinInput').value=''
  }
  
const Join = () => {

  // set default as empty
  const [name, setName] = useState('');

  return (

    <div className="JoinPage">
      <div className="JoinContainer">
        <img src={logo} alt="" className='logo' />
        <h1>Join Page</h1>
        {/* onChange here is when there is a event the change the setNaame to e.target.value */}
        <input placeholder='Enter Your Name' type="text" id='joinInput' onChange={(e)=>setName(e.target.value)}/>
        {/* linking button */}
        {/* link has a onChange which works only when a string is passed if not then not used */}
        {/* prevertDefault is that not allow clicking */}
        <Link onClick={(event)=> !name ? event.preventDefault():null} to="/chat"><button onClick={sendUser} className="joinButton">Login</button></Link>
      </div>
    </div>


  )
}

export default Join
export {user}