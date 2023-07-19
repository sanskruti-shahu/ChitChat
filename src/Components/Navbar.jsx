import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const handleLogOut = () => {
    dispatch({type:"RESET"});
    signOut(auth);
  }
  return (
    <div className="navbar">
      <span className="logo">ChatApp</span>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span>{currentUser?.displayName}</span>
        <button onClick={handleLogOut}>logout</button>
      </div>
    </div>
  )
}

export default Navbar
