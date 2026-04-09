import React, { useState, useEffect } from 'react'
import Table from "@/components/shared/Table.jsx"
import { DashboardUserData } from '@/components/constants/sample.js'
import axios from 'axios'
import {server} from '@/components/constants/config.js'

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "avatar",
    label: "Avatar",
    render: (chat) => {
      const firstAvatar = chat.avatar?.[0]; 

      return firstAvatar ? (
        <img
          src={firstAvatar}
          alt={chat.name}
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-300" />
      );
    }
  },
  { key: "totalMembers", label: "Total-Members", align: "center" },
  {
    key: "members", label: "Members", align: "center",
     render: (chat) => (
      <div className="flex justify-center -space-x-4">
        {chat.members.map((member) => (
          <img
            key={member._id}
            src={member.avatar}
            alt="member"
            className="h-7 w-7 rounded-full border-2 border-white"
          />
        ))}
      </div>
    )
    
    , },
  { key: "totalMessages", label: "TotalMessages", align: "center" },
  { key: "groupChat", label: "GroupChat", align: "center", render: (chat) => (chat.groupChat ? "Yes" : "No"), },
  {
    key: "creator", label: "Created-By",
     align: "center", 
    render: (chat) => {
      const avatar = chat.creator?.avatar;

      if (!avatar) return null;

      return (
        <img
          src={avatar}
          alt={chat.creator?.name}
          title={chat.creator?.name}
          className="h-7 w-7 rounded-full mx-auto"
        />
      );
    }
   },
 
]
const ChatManagement = () => {
    const [rows , setRows] = useState([])

    useEffect(()=>{
  const handelChatData = async() => {
    const { data } = await axios.get(`${server}/api/admin/chats`, {
      withCredentials: true,
    })



    if (data.success) {
      const formattedChats = data.chats.map((chat) => ({
        id: chat._id, // ✅ important

        name: chat.name || "Group Chat",

        avatar: chat.avatar || chat.members[0]?.avatar, // fallback

        totalMembers: chat.members?.length || 0,

        members: chat.members || [],

        totalMessages: chat.totalMessages || 0, 

        groupChat: chat.isGroupChat, 

        creator: chat.creator || {},
      }));

      setRows(formattedChats); 
    }
   
  }
 
      handelChatData()

    },[])
  return (
    <div className=' h-[100vh]'>
      <Table heading={"All Chats"} column={columns} row={rows} pageSize={5} />
    </div>
  )
}

export default ChatManagement
