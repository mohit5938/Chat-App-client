import React, { useState, useEffect } from 'react'
import Table from "@/components/shared/Table.jsx"
import { DashboardUserData } from '@/components/constants/sample.js'
import {server} from '@/components/constants/config.js'
import axios from 'axios'

const columns = [
  {
    key: "id",
    label: "Message ID",
  },

  {
    key: "content",
    label: "Message",
    render: (msg) => {
      const maxLength = 15
      const text = msg.content

      return (text?.length ?? 0) > maxLength
        ? text.slice(0, maxLength) + "..."
        : text

    },
  },

  {
    key: "sender",
    label: "Sender",
    render: (msg) => msg?.sender?.name,
  },

  {
    key: "attachments",
    label: "Attachments",
    align: "center",
    render: (msg) => msg.attachments?.length ?? 0,
  },

  {
    key: "chat",
    label: "Chat ID",
  },

  {
    key: "createdAt",
    label: "Sent At",
    render: (msg) =>
      new Date(msg.createdAt).toLocaleString(),
  },
]

const MessageManagement = () => {
      const [rows , setRows] = useState([])
  useEffect(() => {
    const handleMessages = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/admin/messages`,
          { withCredentials: true }
        );

        if (data.success) {
          const formattedMessages = data.messages.map((msg) => ({
            id: msg._id,               
            content: msg.content,
            sender: msg.sender,         
            attachments: msg.attachments || [],
            chat: msg.chat || "N/A",
            createdAt: msg.createdAt,
          }));

          setRows(formattedMessages);
        }

       
      } catch (error) {
        console.error(error);
      }
    };

    handleMessages(); // ✅ THIS WAS MISSING

  }, []);
  return (
    <div className=' h-[93vh]'>
      <Table heading={"All messages"} column={columns} row={rows} pageSize={5} />
    </div>
  )
}

export default MessageManagement
