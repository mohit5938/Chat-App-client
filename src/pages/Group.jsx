import React, { lazy, Suspense } from "react";
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { CiCircleRemove } from "react-icons/ci";
import { MdGroupAdd } from "react-icons/md";
import { Button } from "@/components/ui/button.jsx";
import { Pencil, Check } from "lucide-react";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import {server} from '@/components/constants/config.js'
import { REFETCH_CHATS } from '../components/constants/event.js'
import {useSocket} from '../util/Socket.jsx'
import { 
  useMyGroupsQuery , 
  useChatDetailsQuery ,
  useRemoveGroupMemberMutation ,
  useDeleteChatMutation
       } from '@/redux/api/api.js'
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog.jsx'))
const ConfirmDeleteDialog = lazy(()=> import ('../components/dialogs/ConfirmDeleteDialog.jsx') )


const Group = () => {
const socket = useSocket();
  const isAddMember = false;


  const navigate = useNavigate();
 
  const [groups, setGroups] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [groupDetail , setGroupDetail] = useState([])
  const [groupName, setGroupName] = useState("");
  const [member , setMember] = useState([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(false);


  const [removeMember] = useRemoveGroupMemberMutation({});

  useEffect(() => {
    setMember([])
  },[selectedChatId])

  const { data, isLoading , refetch} = useMyGroupsQuery("");

  const [deleteGroup, { isLoading: isLoadingDeleteGroup }] =
    useDeleteChatMutation();

  useEffect(() => {
    if (data?.groups) {
      setGroups(data?.groups);
    }
  }, [data]);

  const { data: groupDetails } = useChatDetailsQuery(
    { chatId: selectedChatId, populate: true },
    { skip: !selectedChatId }
  );


  useEffect(() => {
if(groupDetails?.chat){
  setGroupDetail(groupDetails?.chat)
  setMember(groupDetails?.chat?.members)
 
}
  }, [groupDetails])


  const openGroupDetailsHandler = (g) => {
    setIsEditing(true)
    console.log("open")
   
    setSelectedChatId(g._id);
    setGroupName(g.name);
  }


  const openAddMemberHandler = () =>{
  
  setAddMemberOpen(true)
    console.log("add member handeler is clicked")
  }

  const removeMemberHandler = async (userId) => {
    try {
      await removeMember({
        chatId: selectedChatId,
        userId
      }).unwrap();

      toast.success("Member removed ✅");

    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove ❌");
    }
  };
  const deleteGroupHandler = async()=>{
    try {
     
      await deleteGroup({ chatId: selectedChatId }).unwrap();
      toast.success("Group deleted ");
      setGroupName("")
      setMember([])
    
    } catch (err) {
    
      toast.error(err?.data?.message || "Failed ");
    }
   
  }
  const openConfirmGroupHandler = () =>{
    setConfirmDeleteGroup(true )
   
  }
  const closeConfirmGroupHandler = () => {
    setConfirmDeleteGroup(false)
   
  }

  const changeGroupNameHandler = async() =>{

  
   try {
     const { data } = await axios.put(`${server}/api/chat/renameGroup/${selectedChatId}`, {
       name: groupName,
     }, {
       withCredentials: true,
     })
     console.log("hoho")
     if(data.success){
      toast.success("Group Name Changed.")
     }
     else{
      toast.error(data.message)
     }
     setIsEditing(false)
   } catch (error) {
    console.log(error)
     toast.error(error?.response?.data?.message || "Something went wrong")
   }
  }

  const refetchListener = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!socket) return;

    socket.off(REFETCH_CHATS); // clear old listener
    socket.on(REFETCH_CHATS , refetchListener);

    return () => {
      socket.off(REFETCH_CHATS, refetchListener);
    };
  }, [socket, refetchListener]);


 



                    // UI

  return (
    <div className="flex h-full w-full bg-gray-100">

      {/* Left: Group List */}
      <div className="w-1/4 bg-white border-r border-gray-300 p-4">
        <div className="flex items-center justify-between flex-row mb-4"> 
          <h2 className="text-lg font-semibold mb-2 ">
            Groups
            </h2>
          <button
            onClick={ () => navigate('/newGroup')}
          >
            <MdGroupAdd size={25} />
          </button>

      </div>
       

{
          groups?.length > 0 > 0 && (
          groups.map((g) => (
  <div
  key={g._id}
  className="space-y-2 m-2"
  onClick={()=> openGroupDetailsHandler(g)}
  >
    <div className="p-3 rounded-lg bg-blue-100 cursor-pointer">
      <p className="font-medium">{g.name}</p>
      <span className="text-xs text-gray-500">{g.members}</span>
    </div>

  </div>
))
  )
}
        
      </div>

      {/* Right: Group Details */}
   {
    !isEditing && (
      <div className="flex items-center ml-35 font-bold text-blue-600"> click to Open & Edit Group  </div>
    )
   }
    {
        isEditing && <div className="w-3/4 p-6">

          {/* Header */}

          <div className="mb-6">
            {!isEditing ? (
              <div className="flex items-center ">
                <div>
                  <h2 className="text-xl font-semibold">{groupName}</h2>
                  <p className="text-sm text-gray-500">12 Members</p>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="ml-4"
                >
                  <Pencil size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                  autoFocus
                />

                <Button
                  size="icon"
                  onClick={ changeGroupNameHandler}
                >
                  <Check size={18} />
                </Button>
              </div>
            )}
          </div>

          {/* Members */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 ">Members</h3>
            <div className="grid grid-cols-3 gap-3">
              {
                member && member.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-white p-2 rounded shadow text-sm">
                    <span>{user.name}</span>
                    <button
                      onClick={() =>
                       removeMemberHandler(user?._id)
                      }
                  
                      className="text-red-500 hover:text-red-700 flex justify-between "
                    >
                       <CiCircleRemove size={22} />
                    </button>
                  </div>


                ))}
              {
                member.length <= 0 && <p className="text-red-600">
                  add member
                </p>
              }

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={openAddMemberHandler}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-red-600">
              Add Members
            </button>




            <button
              onClick={openConfirmGroupHandler}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Delete Group
            </button>
            {
              <Suspense fallback={null}>
                <AddMemberDialog
                  open={addMemberOpen}
                  handleClose={setAddMemberOpen}
                  chatId = {selectedChatId}
                />
              </Suspense>
            }

            <Suspense fallback={null}>
              <ConfirmDeleteDialog
                open={confirmDeleteGroup}
                handelClose={setConfirmDeleteGroup}
                deleteHandler={deleteGroupHandler}
              />
            </Suspense>

          </div>

        </div>
    }
    </div>
  );
};

export default Group;
