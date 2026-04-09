import React from 'react'
import ChatItem from '../shared/ChatItem.jsx'
import { useSocket } from '@/util/Socket.jsx'
import { useEffect, useCallback } from 'react';
import { NEW_MESSAGE_ALERT } from '../constants/event.js'
import { setNewMessagesAlert } from '@/redux/reducers/chat.js'
import { useSelector, useDispatch } from 'react-redux';
import {getOrSaveFromStorage} from '@/lib/feature.js'


const ChatList = (
    {
        chats = [],
        chatId,
        onLineUsers = [],
        
        handelDeleteChat,
    }
   
) => {

    const { newMessageAlert } = useSelector((state) => state.chat)
    const dispatch = useDispatch();
      const socket = useSocket();

      useEffect(() => {
        getOrSaveFromStorage({
            key: NEW_MESSAGE_ALERT ,
            value: newMessageAlert
        })
      },[newMessageAlert])

    useEffect(() => {
        if (!socket) return;

        socket.off(NEW_MESSAGE_ALERT); // 🔥 clear old listeners

        socket.on(NEW_MESSAGE_ALERT, ({ chatId: incomingChatId }) => {
            if (incomingChatId === chatId) return;

            dispatch(setNewMessagesAlert({ chatId: incomingChatId }));
        });

    }, [socket, chatId, dispatch]);



    return (
        <div className='flex items-center justify-center flex-col'>
            {
                chats?.map((data,index) => {
                   const {avatar , _id , name , isGroupChat , members} = data
                    const alert = newMessageAlert.find(
                        ({ chatId }) => chatId === _id
                    );
                    const isOnline = members?.some((member) =>
                        onLineUsers.includes(member)
                    );
                    
                   return (
                       <ChatItem
                       index ={index}
                           newMessageAlert={alert}
                      isOnline = {isOnline}
                       avatar = {avatar}
                       name = {name}
                       _id = {_id}
                       key = {_id}
                       isGroupChat = {isGroupChat}
                       sameSender = {chatId === _id }
                        handelDeleteChat = { handelDeleteChat}
                       />
                    )
                })}

        </div>
    )
};


export default ChatList
