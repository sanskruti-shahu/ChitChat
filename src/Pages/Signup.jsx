import React, { useContext, useState } from 'react';
import camera from '../images/camera.svg';
import logoImg from '../images/ChitChatLogo.png';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {storage,auth,db} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';

const Signup = () => {

  const [err,setErr] = useState(false);
  const navigate = useNavigate();
  const {dispatch} = useContext(ChatContext);

  const handleSubmit = async (event) => 
  {
    event.preventDefault(); 
    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const file = event.target[3].files[0];

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          setErr(true);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
            console.log('File available at', downloadURL);
            await updateProfile(res.user,{
              displayName,
              photoURL:downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              displayName,
              email,
              uid:res.user.uid,
              photoURL:downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid),{});

            navigate("/");
          });
        }
      );
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
          <h3 style={{color: '#2b2130', fontSize:'1.5rem'}}>Create Account</h3>
          <input type="text" placeholder='display name'/>
          <input type="email" placeholder='email'/>
          <input type="password" placeholder='password'/>
          <input type="file" style={{display: 'none'}} id='file'/>
          <label htmlFor='file'>
          <img src={camera} alt="" />
            Add Profile Photo
          </label>
          <button>Sign Up</button>
          {err ? <span style={{color: 'red', fontSize:'15px', fontWeight:'400'}}>Something went Wrong</span> : <span></span>}
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn"><Link to="/login" style={{fontSize:'12px', color:'white', fontWeight:'400',}}>Login</Link></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
