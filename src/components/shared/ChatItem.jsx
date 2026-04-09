import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge.jsx"
import DeleteChatMenu from '../dialogs/DeleteChatMenu.jsx'
import LeaveGroupMenu from '../dialogs/LeaveGroup.jsx'
import {useState} from "react"
import { useDeleteChatMutation, useLeaveGroupMutation } from '@/redux/api/api.js'

const ChatItem = ({
  avatar = [],
  name,
  _id,
  isGroupChat = false,
 sameSender,
 isOnline,
  newMessageAlert = null,
  index = 0,
  
}) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [openChatDelete , setOpenChatDelete] = useState(false);
  const [openLeaveGroup , setOpenLeaveGroup] = useState(false);

  const [deleteMyChat] = useDeleteChatMutation();
  const [leaveGroup ] = useLeaveGroupMutation();
  
  const handelClose = () => {
    setOpenChatDelete(false)
  }

  const deleteHandler = () => {
    if (!selectedChatId) return;
    deleteMyChat({ chatId: selectedChatId })
    setOpenChatDelete(false);
  }

  const leaveHandler = () => {
    if (!selectedChatId) return;
    leaveGroup({chatId: selectedChatId})
    setOpenLeaveGroup(false)
  }

  const handelCloseGroupMenu = () => {
    setOpenLeaveGroup(false)
  }

  const handelDeleteChatItem = (e, _id, isGroupChat) => {
    e.preventDefault();
    setSelectedChatId(_id);
    if( !isGroupChat){
      setOpenChatDelete(true); 
    }
    else{
      setOpenLeaveGroup(true);
    }
  }

  return (
    <>
      <Link
        to={`/chat/${_id}`}
        onContextMenu={(e) => handelDeleteChatItem(e, _id, isGroupChat)}
        className="block"
      >
        <div
          className={`m-2 w-[380px] flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${sameSender
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          {/* Left side: avatar + name + messages */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {isGroupChat ? (
              <div className="relative h-12 w-12">
                {avatar.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="group"
                    className="h-6 w-6 rounded-full border-2 border-white absolute"
                    style={{
                      left: `${i * 12}px`,
                      top: `${i * 6}px`,
                      zIndex: 10 - i,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatar[0]} />
                <AvatarFallback>{name?.[0]}</AvatarFallback>
              </Avatar>
            )}
            {/* Name and new message info */}
            <div className="flex flex-col">
              <span className="font-medium text-base">{name}</span>

              {newMessageAlert?.count > 0 && (
                <Badge
                  variant="secondary"
                  className="w-fit text-xs font-semibold mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                  {newMessageAlert?.count} New Message
                </Badge>
              )}
            </div>
          </div>

          {/* Right side: Online Indicator */}
          {isOnline && (
          <div
            className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
          ></div>
        )}
        </div>
      </Link>
      
      <DeleteChatMenu
        open={openChatDelete}
        handelClose={handelClose}
        deleteHandler={deleteHandler}
      />
      <LeaveGroupMenu 
      open ={openLeaveGroup}
        handelClose = {handelCloseGroupMenu}
        leaveHandler={leaveHandler}
      />
      </>
    

  
  
  );
};

export default memo(ChatItem);
