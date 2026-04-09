import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input"
import Search from '../specific/Search.jsx'
import { server } from '../constants/config.js'
import axios from 'axios'
import { useSocket } from '@/util/Socket.jsx'
import { toast } from "react-toastify";
import { Navigate, useNavigate } from 'react-router-dom';
import { userNotExists, userExists } from '@/redux/reducers/auth.js'
import { useSelector, useDispatch } from "react-redux";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {setIsMobile} from '@/redux/reducers/misc.js'
import {
  incrementNotification,
  resetNotificationCount,
 } from '@/redux/reducers/chat.js'
import { NEW_REQUEST } from '../constants/event.js'







const Header = () => {
  const socket = useSocket();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth)
   
    const {isMobile,isSearch} = useSelector((state) => state.misc)
    const { notificationCount } = useSelector((state) => state.chat)
    const handelMobile = () => {
        dispatch(setIsMobile(!isMobile))
       
    }

    const newRequestHandler = useCallback(() => {
   
        dispatch(incrementNotification())
    }, [dispatch])

    useEffect(() => {
        if (!socket) return;

        socket.on(NEW_REQUEST, newRequestHandler);

        return () => {
            socket.off(NEW_REQUEST, newRequestHandler);
        };
    }, [socket, newRequestHandler]);
  

    const handelLogout = async () => {
        try {
            const { data } = await axios.post(
                `${server}/api/user/logout`,
                {},
                { withCredentials: true }
            );

           

            if (data.success) {
                toast.success(data.message);
                dispatch(userNotExists());
                navigate("/login");
            }

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            toast.error(message);
        }
    };

    return (
        <div className='flex items-center flex-col justify-center '>
            <div className='w-full p-4 flex justify-between items-center'>
                <div onClick={() => navigate('/')} className='font-extrabold text-blue-600'>
                    <h1>MSCA</h1>
                    <div className='mt-4 block md:hidden ' onClick={handelMobile}>
                        {isMobile ? <FaArrowCircleRight size={28} /> : <FaArrowCircleLeft size={28}  />}
                    </div>
                </div>
                <div className="relative">
                    <Search />
                </div>
                <div className='flex items-center justify-center'>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger>
                                <div className="relative">
                                    <IoMenu />

                                    {notificationCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
                                    )}
                                </div>
                            </MenubarTrigger>
                            <MenubarContent>


                                <MenubarItem onClick={() => navigate('/newGroup')} >
                                    <div className='flex items-center justify-center gap-6 '>
                                        <p className='font-bold'>NewGroup</p>
                                      
                                      <div className='flex '>
                                            <IoMdAdd /><FaUserGroup />
                                      </div>

                                    </div>
                                </MenubarItem>

                                <MenubarSeparator />
                                <MenubarItem onClick={() => navigate('/Group')}>
                                    <div className='flex items-center justify-center gap-6 '>
                                        <p className='font-bold'>Group</p>
                                        <FaUserGroup />
                                    </div>
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem
                                    onClick={() => {
                                        dispatch(resetNotificationCount());  //  reset count
                                        navigate("/notification");           // optional navigation
                                    }}
                                >
                                    <div className='flex items-center justify-center gap-6 '>
                                        <p className='font-bold'>Notifications</p>
                                        <div className="relative">
                                            <IoNotificationsSharp />

                                            {notificationCount > 0 && (
                                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                                                    {notificationCount > 99 ? "99+" : notificationCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </MenubarItem>
                                <MenubarSeparator />
                                {
                                    user?.role ==="admin" && (
                                        <MenubarItem onClick={() => navigate('/admin/login')}>
                                            <div className='flex items-center justify-center gap-6 '>
                                                <p className='font-bold'>admin Login</p>
                                                <RiAdminFill />
                                            </div>
                                        </MenubarItem>
                                    )
                                }
                                <MenubarItem onClick={handelLogout}>
                                    <div className='flex items-center justify-center gap-6 '>
                                        <p className='font-bold'>Logout</p>
                                        <FiLogOut />
                                    </div>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>



        </div>

    )
}

export default Header;
