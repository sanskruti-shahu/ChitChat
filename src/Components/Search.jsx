import React, { useContext, useState } from 'react';
import { collection, query, where, getDoc, setDoc, getDocs, updateDoc, doc, serverTimestamp} from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err,SetErr] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const handleSearch = async () => {  
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", username));

    try
    {
      const querySnapshot = await getDocs(q);
      SetErr(true); 
      
      querySnapshot.forEach((doc) => {
        setUser(doc.data()); 
        SetErr(false);
      });
    }
    catch(err)
    {
      SetErr(true);
    }
  }

  const handleKey = (e) => {
    if(e.code === "Enter") handleSearch();
  }

  const handleSelect = async () => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try{

      const res = await getDoc(doc(db, "chats", combinedId)); 

      if(!res.exists()) 
      {
        await setDoc(doc(db, "chats", combinedId), { messages:[] })
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId+".userInfo"]: {
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        })
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId+".userInfo"]: {
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        })
      }
    }
    catch(err){
    }

    setUser(null);
    setUsername("");
    
    dispatch({type:"CHANGE_USER", payload:user});
  }

  return (
    <div className="search">
      <div className="searchForm">
        <span className="magnifier">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M228 68.7c-68.5 0-124 55.5-124 124 0 68.5 55.5 124 124 124 68.5 0 124-55.5 124-124C352 124.2 296.5 68.7 228 68.7zM228 283.3c-50 0-90.6-40.6-90.6-90.6 0-50 40.6-90.6 90.6-90.6s90.6 40.6 90.6 90.6C318.6 242.7 278 283.3 228 283.3z" className="a"/><path d="M392.8 414.3c6.1 9.2 4.1 21.3-4.4 26.9 -8.5 5.7-20.5 2.8-26.6-6.4l-88.6-133.2c-6.1-9.2-4.1-21.3 4.4-26.9 8.5-5.7 20.5-2.8 26.6 6.4L392.8 414.3z" className="a"/></svg>
        </span>
        <input type="text" placeholder='Find a User' onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)} value={username} />
      </div>
      {err && <div className="userChat" style={{padding:"7% 25%", fontSize:"12px", color:"#BEBEBE"}} ><span>User not found</span></div>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search
