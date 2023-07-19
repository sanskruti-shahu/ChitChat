import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {
  const [chats,setChats]= useState([]);

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      try{
        const docRef = doc(db, "userChats", currentUser.uid);
        const unsub = onSnapshot(docRef, (doc)=> {
          setChats(doc.data());
        }); //onSnapshot use coz whenever any change happen it will automatically update

        return () => { unsub(); }
      }
      catch(err){
        // console.log(err);
      }
    }

    if(currentUser.uid) getChats();

  },[currentUser.uid]);

  const handleSelect = (user) => {
    dispatch({type:"CHANGE_USER", payload:user});
  }

  return (
    <div className="chats">
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map((chat)=>{ //this Object.entries converts nested objects as arrays also ? means "if exists then" 
        return (
          <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>  {/*? means "if exists then"  */}
            </div>
          </div>)
      })}
    </div>
  )
}

export default Chats
