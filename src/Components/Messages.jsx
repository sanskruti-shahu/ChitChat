import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { ChatContext } from '../context/ChatContext';

const Messages = () => {

  const [messages,setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  useEffect(() => {
    const getMessages = () => {
      try{
        const docRef = doc(db, "chats", data.chatId);
        const unsub = onSnapshot(docRef, (doc)=> {
          if(doc.exists()) {setMessages(doc.data().messages)}
        }); 

        return () => { unsub(); }
      }
      catch(err){
        // console.log(err);
      }
    }

    if(data.chatId) getMessages();

  },[data.chatId])

  return (
    <div className='messages'>
    {messages.map((eachMessage)=>{
      return (<Message key={eachMessage.id} message={eachMessage} />) 
    })}
    </div>
  )
}

export default Messages
