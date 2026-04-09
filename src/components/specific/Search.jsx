import React from 'react'
import {Button} from "@/components/ui/button.jsx"
import { useState, useEffect, useRef } from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { useLazySearchUserQuery ,useSendFriendRequestMutation } from "@/redux/api/api";
import { IoPersonAddSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {  toast } from "react-toastify";

const Search = () => {
   const [search , setSearchValue] = useState("");
   const [ result , setResult ] = useState([]);
  const [searchUser, { data, isLoading, error }] = useLazySearchUserQuery()
   const {isSearch} = useSelector((state) => state.misc)
   const [showResult , setShowresult ] = useState(false);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const [sendFriendRequest] = useSendFriendRequestMutation();

  //handel add friend
  const handleAddFriend = async (id) => {
  

    try {
      const res = await sendFriendRequest({ userId: id }).unwrap();

      toast.success(res.message || "Request has been sent ✅");

    } catch (error) {
      console.log("ERROR:", error);
      toast.error(error?.data?.message || "Something went wrong ");
    }
  };

  //handel submit form
  const handleSubmit = (e) => {
    e.preventDefault();
   
    const filtered = users.filter((user) =>
      user.toLowerCase().includes(search.toLowerCase())
    );
    setResult(filtered);
    setShowresult(true);
  };

  const handleClose = () => {
    setShowresult(false);
    setResult([]);
    setSearchValue("")
  };

  // ✅ Click Outside Handler
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowresult(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(()=> {
 const timeOUtId = setTimeout(() => {

   try {
     searchUser(search)
    
     setResult(data?.users)
     setShowresult(true);
   } catch (error) {
    console.log(error)
   }

 },500)

 return () => {
  clearTimeout(timeOUtId)
 }
  },[search])

  return (
    <div ref={dropdownRef} >
      
      <div className='relative   w-[380px] flex items-center justify-center mt-2 flex-col'>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='flex flex-row items-center gap-2  '>
            <input
              type="text"
              placeholder="Search users"
              value={search}
              onChange={(e) => setSearchValue(e.target.value)}
              className="
    w-[280px] 
    p-3 
    rounded-2xl 
    border 
    border-gray-300 
    shadow-sm 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-400 
    focus:border-blue-400 
    transition 
    duration-200
  "
            />

            {
              showResult &&
              <button
                onClick={handleClose}
                className="ml-2  text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            }
          </div>
        
         
        </form>

        {showResult && (
result?.length > 0 ? (
            <ul className="absolute top-[120%] right-4 w-full bg-white shadow-lg rounded-xl p-2 z-50 max-h-64 overflow-y-auto">
              {result.map((user, index) => (
                <li
                  key={index}
                  className="p-2 mb-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                   <div className='w-[250px]   flex items-center justify-between '>
                    <div className='flex items-center justify-center flex-row gap-2 '>
                      <Avatar className="h-8  w-8  border border-gray-300 shadow-sm">
                        {user?.avatar ? (
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                        ) : (
                          <AvatarFallback>
                            <RxAvatar className="w-6 h-6 text-gray-400" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <p className='font-bold text-blue-600'>{user?.name}</p>
                    </div>
                    <div className='flex items-center justify-center '>
<Button className="p-1 " onClick={() => handleAddFriend(user?._id)}>
                        <IoPersonAddSharp />
</Button>
                    </div>
                   
                   </div>
                  
                </li>
              ))}
            </ul>)

            : (<p className="text-gray-500 text-center">No users found</p>)
        )}
      </div>

    </div>
  )
}

export default Search
