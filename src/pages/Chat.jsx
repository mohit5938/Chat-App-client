import React from 'react'
import { MdOutlineSend } from "react-icons/md";
import { IoIosAttach } from "react-icons/io";
import { useRef, useState, useEffect, useCallback } from 'react'
import MessageComponents from './../components/shared/MessageComponents';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js'
import { useSocket } from '../util/Socket.jsx';
import { NEW_MESSAGE } from '@/components/constants/event.js'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from "axios";
import { server } from '../components/constants/config.js';
import { removeNewMessageAlert } from '@/redux/reducers/chat.js'
import {
  START_TYPING,
  STOP_TYPING,
  USER_ONLINE,
  CHAT_JOINED,
  CHAT_LEAVED
} from '../components/constants/event.js'

const Chat = () => {

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [message , setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [page , setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const [IamTyping , setIamTyping] = useState(false);
  const [userTyping , setUserTyping] = useState(false);

  const typingTimeout = useRef(null);


  const { user } = useSelector((state) => state.auth)
 

  const socket = useSocket();
  const { chatId } = useParams();

  // Track the previous chatId to detect changes
  const prevChatIdRef = useRef(null);
 

  const chatDetails =  useChatDetailsQuery({chatId  })

  const members = chatDetails?.data?.chat?.members

  

  useEffect(() => {
    socket.emit(CHAT_JOINED,{userId : user._id , members})
    return () => {
      socket.emit(CHAT_LEAVED , {userId: user._id , members})
      dispatch(removeNewMessageAlert(chatId));
      setMessages([]);  // clear old chat
      setMessage("")
      setPage(1); 
    }       

  }, [chatId,socket]); 
  
  // when page count is change it automatically call this api

  const oldMessagesChunks = useGetMessagesQuery({ chatId, page })

  // ================= LOAD OLD MESSAGES =================
  useEffect( () => {
    if (oldMessagesChunks?.data?.messages) {
      const newMsgs = oldMessagesChunks.data.messages;

      setMessages((prev) => {
       

        const uniqueMsgs = newMsgs.filter(
          (msg) => !prev.some((p) => p._id === msg._id)
        );

        return [...uniqueMsgs , ...prev]; // 👈 prepend
      });

      setTimeout(() => {
        setLoadingMore(false);
      }, 300);
    }
  }, [oldMessagesChunks?.data?.messages]);

  // ================= INFINITE SCROLL =================


  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || loadingMore) return;

    const isNearTop = el.scrollTop <= 10;

    if (isNearTop) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };


  // ================= SUBMIT MSG =================
  const handelSubmit = async(e) => {
    e.preventDefault();

    if (!message.trim() && files.length === 0) return;

    if (files.length > 0) {
    try {
      setSending(true);
      toast.success("Attachment sending...")
      const formData = new FormData();

      formData.append("chatId", chatId);
      formData.append("content", message);

      files.forEach((file) => {
        formData.append("attachments", file);
      });

     const {data} = await axios.post(`${server}/api/chat/message`, formData, {
        withCredentials: true
      });

      if( ! data.success ){
        toast.error(data.message)
        
      }
     

      setFiles([]);
      setMessage("");
    } catch (error) {
      console.log(error)
    } finally {
      toast.success("Attachment Send successfull")
      setSending(false); 
    }
    }
    else {
      // CASE: only text → socket
      socket.emit(NEW_MESSAGE, {
        chatId,
        members,
        message,
      });
      toast.success("Message Sent Successfully")
      setMessage("");
    }
    // force scroll when YOU send
    scrollToBottom();
    
  }

  // ================= REAL-TIME MESSAGES =================
  const newMessageHandler = useCallback(({ chatId: incomingChatId, message }) => {
    // Only add message if it belongs to the currently open chat
    if (incomingChatId !== chatId) return;

    setMessages((prev) => {
      const exists = prev.some((msg) => msg._id === message._id);
      if (exists) return prev;

      return [...prev, message];
    });
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;

    socket.off(NEW_MESSAGE); // clear old listener
    socket.on(NEW_MESSAGE, newMessageHandler);

    return () => {
      socket.off(NEW_MESSAGE, newMessageHandler);
    };
  }, [socket, chatId, newMessageHandler]);



  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //  Optional: check if user is near bottom
  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;

    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (page === 1 && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, page]);

// handel file changes 
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if ( selectedFiles.length <= 0 ) {
      toast.error("Insert files ")
      return ;
    }
    if (selectedFiles.length > 5 ){
      toast.error("You Can Only Send 5 fils at a time ");
      return ;
    }
    setFiles(selectedFiles);
  };


  const handelMessageChange = (e) => {
    setMessage(e.target.value)
    if(!IamTyping){
      socket.emit(START_TYPING, { members, chatId })
      setIamTyping(true);
    }

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING,{members,chatId})
      setIamTyping(false);
    },1000)
  }

  const startTypingListner = (data) => {
    if (data.chatId !== chatId) return;
    console.log("typing...", data);
    setUserTyping(true)
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(START_TYPING, startTypingListner);

    return () => {
      socket.off(START_TYPING, startTypingListner);
    };
  }, [socket, chatId]);

  const stopTypingListner = (data) => {
    if (data.chatId !== chatId) return;
    console.log("stop typing...", data);
    setUserTyping(false)
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(STOP_TYPING, stopTypingListner);

    return () => {
      socket.off(STOP_TYPING, stopTypingListner);
    };
  }, [socket, chatId]);

                 // UI 
  return (
    <div className="h-full flex flex-col" >

      <div
       ref={containerRef}
        onScroll={handleScroll}
      className='flex-1 overflow-y-auto px-2 py-3 space-y-2'
      >
        {loadingMore && (
          <p className="text-center text-sm text-gray-500">
            Loading more...
          </p>
        )}

{messages.map((i)=> (
  <MessageComponents key={i._id}  message={i} user={user} />
))}
        {userTyping && (
          <div className="flex items-center gap-2 px-2">
            <div className="bg-gray-200 px-3 py-2 rounded-2xl w-fit">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
</div>
     
      <form
       className='h-16 px-4 flex items-center gap-3 bg-white border-t'
       onSubmit={handelSubmit}
       >

        {/* Input Box */}
      

        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            className='flex-1 bg-transparent outline-none text-sm'
            placeholder='Type a message...'
            value={message}
            onChange={handelMessageChange}
          />

          {/* Attach Icon */}
          <IoIosAttach
            className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition"
            onClick={() => fileInputRef.current.click()} 
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Send Button */}
        <button type="submit" disabled={sending} >
          {
            sending ? (
              <span className="text-sm text-gray-500">Sending...</span>
            ):(
                <MdOutlineSend
                  className="text-3xl text-blue-600 cursor-pointer hover:text-blue-700 transition"
                />
            )
          }
         
        </button>

      </form>
</div>
  )
}

export default Chat
