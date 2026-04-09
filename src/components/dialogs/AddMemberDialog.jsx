import React from 'react'
import {useState} from 'react'
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAddGroupMemberMutation, useMyAvailableFriendsQuery } from '@/redux/api/api.js'


import { toast } from "react-toastify";
import { useEffect } from 'react';

const AddMemberDialog = ({ open, handleClose , chatId }) => {
 
    
      const [selectedMembers , setSelectedMembers] = useState([]);
  
    
    const [addMember] = useAddGroupMemberMutation()
    const { data, refetch } = useMyAvailableFriendsQuery(chatId)

  useEffect(() => {
    refetch()
  }, [open, handleClose, chatId])
 


const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((curr_id) => curr_id !== id)
        :
        [...prev, id]
    )
}

    const addMemberHandler = (user) => {
      
        selectMemberHandler(user._id)
        
     
    };


      const submitHandler = async () => {
          try {
              await addMember({ members: selectedMembers, chatId }).unwrap();
             
              toast.success("Members added ✅");
              setSelectedMembers([])
              handleClose(false)
          } catch (err) {
              console.log(err);
              toast.error(err?.data?.message || "Failed to add ❌");
          }
      }

  
  return (
      <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>ADD MEMBER</DialogTitle>
                  <DialogDescription>
                      Add members from the list below.
                  </DialogDescription>
              </DialogHeader>

         

              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {data?.availableFriends.map((user) => (
                      <div
                          key={user?._id}
                          className="flex items-center justify-between border rounded px-3 py-2"
                      >
                          <span className="text-sm font-medium">{user.name}</span>

                          <Button
                              size="icon"
                              variant={selectedMembers.includes(user?._id) ? "default" : "outline"}
                              onClick={() => addMemberHandler(user)}
                          >
                              {selectedMembers.includes(user._id) ? "✓" : <Plus size={16} />}
                          </Button>
                      </div>
                  ))}
              </div>

              <DialogFooter>
                  <Button variant="outline" className="bg-red-500 text-white" onClick={() => handleClose(false)}>
                      Close
                  </Button>

                  <Button variant="outline" onClick={() => submitHandler() } >
                      Submit Changes
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  )
}

export default AddMemberDialog
