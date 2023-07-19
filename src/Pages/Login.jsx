import React, { useContext, useState } from 'react';
import logoImg from '../images/ChitChatLogo.png'
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";
import { Link, useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';

const Login = () => {
  const [err,setErr] = useState(false);
  const navigate = useNavigate();
  const {dispatch} = useContext(ChatContext);

  const handleSubmit = async (event) => 
  {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    try{
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/");
        // ...
      })
      .catch((error) => {
        setErr(true);
      });
    }
    catch(err)
    {
      setErr(true);
    }
  };

  return (
    <div class="formContainer" >
      <div class="form-container sign-up-container">
        <form onSubmit={handleSubmit} action='#'>
          <div className="title">
            <img src={logoImg} />
            <h1 style={{color: '#2b2130'}}>ChitChat</h1>
          </div>
          <h3 style={{color: '#2b2130', fontSize:'1.5rem'}}>Login</h3>
          <input type="email" placeholder='email'/>
          <input type="password" placeholder='password'/>
          <button>Login</button>
        </form>
        {err ? <span style={{color: 'red', fontSize:'18px'}}>Wrong email or Password</span> : <span></span>}
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp"><Link to="/signup" style={{fontSize:'12px', color:'white', fontWeight:'400',}}>Sign Up</Link></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
