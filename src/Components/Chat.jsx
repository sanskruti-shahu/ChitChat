import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
  
  const {data} = useContext(ChatContext);

  return (
    <div className="chat">
      {data.chatId!='null' && data.user!=null ? <div className="chatInfo">
        <img src={data.user?.photoURL} />
        <span>{data.user?.displayName}</span>
      </div> : <div className="chatInfo" style={{height: '60px', borderBottom: '0px'}}></div>}
      {data.chatId!='null' && data.user!=null ? <Messages /> : <div style={{textAlign: 'center', padding: '150px 0px'}}><h1>ChatApp</h1><h3>Select chat to start Conversation</h3></div>}
      {data.chatId!='null' && data.user!=null && <Input />}
    </div>
  )
}

export default Chat
