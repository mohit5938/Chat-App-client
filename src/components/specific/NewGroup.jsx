import React, { useState } from "react";
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { useMyAvailableFriendsQuery } from '@/redux/api/api.js'
import { setIsNewGroup } from '@/redux/reducers/misc.js'
import axios from "axios";
 import { useDispatch ,useSelector} from 'react-redux';
import {server} from '../constants/config.js'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const NewGroup = () => {

  const {isError , isLoading , data , error} = useMyAvailableFriendsQuery();
  console.log(data)
const dispath = useDispatch();
const navigate = useNavigate();
  const { isNewGroup } = useSelector(state => state.misc)

 
  const [members , setMembers] = useState([])
  const [groupName , setGroupName] = useState("");
  const [selectedMembers , setSelectedMembers] = useState([]);

  const selectMemberHandler = (id)=> {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((curr_id) => curr_id !== id)
  :
  [...prev , id]
  )
  }

 const submitHandler = async(e) => {
  e.preventDefault()
   if (!groupName.trim()) return toast.error("Group name is required...")
   if (selectedMembers.length < 2) return toast.error("Group must have at least 2 members..")
console.log(groupName,selectedMembers) 
   try {
     const { data } = await axios.post(
       `${server}/api/chat/newGroup`,
       {
         name: groupName,
         member: selectedMembers, 
       },
       {
         withCredentials: true,
       }
     );

    
     toast.success("Group created successfully");

     cancelHandler(); // reset form
   } catch (error) {
     console.error(error);
     toast.error(error?.response?.data?.message || "Something went wrong");
   }
}

 const cancelHandler = () => {
console.log("close hadneler called")
   setGroupName("")
   setSelectedMembers([])
   navigate('/')
   
 }

 return (
    <div className='mt-2 flex items-center justify-center flex-col'>
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Create New Group</h1>
     <div>
       <form onSubmit={submitHandler}>
        <div className="flex   flex-col">
        
            <input
              type="text"
              name="member"
              placeholder="Enter Group Name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="
    w-full 
    px-4 
    py-2.5 
    rounded-xl 
    border border-gray-300 
    bg-white
    text-gray-800

    focus:outline-none 
    focus:ring-4 
    focus:ring-blue-200 
    focus:border-blue-500 

    shadow-sm 
    transition-all 
    duration-300
    placeholder:text-gray-400
  "
            />

         
        </div>

      
<ul className="mt-4 mb-4 ">
  {
             data?.uniqueFriends?.length > 0 && data?.uniqueFriends?.map((user)=> {
    return (
      <li key={user._id} className="mt-2 flex items-center justify-between">

        {/* Name */}
        <p className="text-gray-800 font-medium">{user?.name}</p>

        {/* Add Button */}
        {selectedMembers.includes(user._id) ? <button
          type="button"
          className="rounded-full bg-red-600 text-white px-3 py-1 font-bold hover:bg-blue-700"
          onClick={() => selectMemberHandler(user?._id)}
        >
          -
        </button> :
          <button
            type="button"
            className="rounded-full bg-blue-600 text-white px-3 py-1 font-bold hover:bg-blue-700"
            onClick={() => selectMemberHandler(user?._id)}
          >
            +
          </button>
        }
   

      </li>
    )
  })
  }

</ul>
          <div className='flex itmes-center justify-center gap-2 p-2 '>
            <button
             type="button"
             onClick={cancelHandler}
            className='text-red-600 p-2'>CENCEL</button>
            <button 
           type="submit"
            className='bg-blue-500 p-2  text-amber-50 rounded-2xl '
            >CREATE</button>
          </div>
      </form>
     </div>
    </div>
  )
}

export default NewGroup
