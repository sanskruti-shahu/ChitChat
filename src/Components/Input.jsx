import React, { useContext, useState } from 'react';
import Attach from '../images/attach.svg';
import {storage,db} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion, Timestamp, setDoc, serverTimestamp } from "firebase/firestore"; 
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import {v4 as uuidv4} from 'uuid';

const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () => {
    if(img) {
      try{
        const storageRef = ref(storage, uuidv4()); //here unique id is needed to store image 
        //(uuid in react use to generate unique ids) else it will keep replacing current image and onChange 
        //will not work due to this because it will not detect any new file
  
        const uploadTask = uploadBytesResumable(storageRef, img)
  
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                // console.log('Upload is paused');
                break;
              case 'running':
                // console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            // console.log(error)
          }, 
          () => {
              getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages:arrayUnion({
                    text:text,
                    img:downloadURL,
                    id:uuidv4(),
                    senderId:currentUser.uid,
                    date:Timestamp.now(),
                  })
                })

                await updateDoc(doc(db, "userChats", data.user.uid), {
                  [data.chatId+".lastMessage"]:{
                    img:downloadURL
                  },
                  [data.chatId+".date"]:serverTimestamp()
                })

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                  [data.chatId+".lastMessage"]:{
                    img:downloadURL
                  },
                  [data.chatId+".date"]:serverTimestamp()
                })
            });
          }
        );
      }
      catch(error)
      {
        // console.log(error);
      }
    }
    else if(text){
      await updateDoc(doc(db, "chats", data.chatId), {
        messages:arrayUnion({
          text:text,
          img:null,
          id:uuidv4(),
          senderId:currentUser.uid,
          date:Timestamp.now()
        })
      })

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId+".lastMessage"]:{
          text:text
        },
        [data.chatId+".date"]:serverTimestamp()
      })

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId+".lastMessage"]:{
          text:text
        },
        [data.chatId+".date"]:serverTimestamp()
      })
    }
    setImg(null)
    setText("")
  }

  return (
    <div className="input">
      <textarea  placeholder="Type a message here... " onChange={(e) => {setText(e.target.value)}} value={text} ></textarea>
      <div className="send"> 
        <input type="file"  id="file" style={{display: 'none'}} accept="image/*" onClick={(e)=> {e.target.value = null}} onChange={(e)=> {setImg(e.target.files[0])}}/>
        <label htmlFor="file" >
          <img src={Attach} alt="" accept="image/*" onClick={(e)=> {e.target.value = null; console.log("se",e.target.value)}} onChange={(e)=> {setImg(e.target.files[0]); console.log("IMh")}} />
        </label>
        <button onClick={handleSend}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.2 30.1"><path class="st0" d="M2.1 14.6C8.9 12 28.5 4 28.5 4l-3.9 22.6c-0.2 1.1-1.5 1.5-2.3 0.8l-6.1-5.1 -4.3 4 0.7-6.7 13-12.3 -16 10 1 5.7 -3.3-5.3 -5-1.6C1.5 15.8 1.4 14.8 2.1 14.6z"/></svg></button>
      </div>
    </div>
  )
}

export default Input
