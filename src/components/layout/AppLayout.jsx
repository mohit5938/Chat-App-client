import React from 'react'
import Header from './Header'
import { Outlet, useParams } from 'react-router-dom'
import ChatList from '../specific/ChatList.jsx'
import { sampleChats } from '../constants/sample.js'
import Profile from '../specific/Profile.jsx'
import { useMyChatsQuery }  from '@/redux/api/api.js'
import { useSelector, useDispatch } from 'react-redux';
import {setIsMobile} from '@/redux/reducers/misc.js'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,   // optional (you don't need it)
} from "@/components/ui/sheet";
import { useSocket } from '@/util/Socket.jsx'
import { useEffect , useState } from 'react';
import { NEW_MESSAGE_ALERT, REFETCH_CHATS, USER_ONLINE } from '../constants/event.js'



const AppLayout = () => {
  const params = useParams();
  const chatId = params.chatId;
  const dispatch = useDispatch();

  const socket = useSocket();

 const [onlineUsers , setOnlineUsers] = useState([]);
    

  const {isMobile } = useSelector((state) => state.misc)
  const {user} = useSelector((state) => state.auth)
 
const {isLoading , data , isErrors , error , refetch} = useMyChatsQuery("");

const handelMobileClose = () => dispatch(setIsMobile(false))

  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      refetch();
    };

    socket.on(REFETCH_CHATS, handler);

    return () => {
      socket.off(REFETCH_CHATS, handler); 
    };
  }, [socket, refetch]);

  useEffect(() => {

    if (!socket) return;
    const onLineUsersHandler = (data) => {
      setOnlineUsers(data);
      
    }
    socket.on(USER_ONLINE, onLineUsersHandler)
    return () => {
      socket.off(USER_ONLINE, onLineUsersHandler );
    };
  }, [socket])

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Header />

     
      <Sheet
        open={isMobile}
        onOpenChange={handelMobileClose}
      >
        <SheetContent side="left" className="w-full p-0 ">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Chats</SheetTitle>
            <SheetDescription>
              Select a conversation
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              onLineUsers={onlineUsers}
             
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 md:grid-cols-[380px_1fr_340px] gap-1 p-4 h-[calc(100vh-74px)] ">
      


       {/* Column 1 - Chat List */}
        <div className="hidden md:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-y-auto overflow-x-hidden">
          <ChatList
            chats={data?.chats}
            chatId= {chatId}
            onLineUsers={onlineUsers}
           
          />
        </div>

        {/* Column 2 - Chat Window */}
        <div className="bg-gray-50 dark:bg-gray-850 text-gray-900 dark:text-gray-100 rounded-lg h-full overflow-y-auto shadow-inner">
          <Outlet />
        </div>

        {/* Column 3 - Info / Details */}
        <div className="hidden md:flex flex-col h-full overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-gray-100 text-center">
          <Profile user={user} />
        </div>
      </div>
    </div>
  )
}

export default AppLayout
