import React, { useState } from 'react'
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import axios from 'axios'
import { server } from '@/components/constants/config.js'
import { BsChatSquareHeartFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
const Sidebar = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) =>
        location.pathname === path;

    const baseClass =
        "flex items-center gap-2 cursor-pointer transition mt-4 font-bold px-3 py-2 rounded-md";

    const activeClass =
        "bg-indigo-500 text-white";

    const inactiveClass =
        "text-slate-200 hover:text-indigo-400";

    const handleLogout = async() =>{
        try {
            const { data } = await axios.get(
                `${server}/api/admin/adminLogout`,
                { withCredentials: true }
            );

            if (data.success) {
              
                navigate("/admin/login"); 
        }
     } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="w-full h-full bg-slate-900 text-slate-100 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-indigo-400">
                Admin Panel
            </h2>

            <ul className="space-y-3 text-sm">
                <Link to={"/admin/Dashboard"}>
                    <li className={`${baseClass} ${isActive("/admin/Dashboard")
                            ? activeClass
                            : inactiveClass
                        }` }>
                     <span >
                            <MdDashboard size={22}  />
                     </span>
                        Dashboard
                    </li>
                </Link>
                <Link to={"/admin/userManagement"}>
                    <li className={`${baseClass} ${isActive("/admin/userManagement")
                        ? activeClass
                        : inactiveClass
                        }`}>
                        <span >
                            <FaUserCog size={22} />
                        </span>
                        Users
                    </li>
              </Link>
              
                <Link to={"/admin/chatManagement"}>
                    <li className={`${baseClass} ${isActive("/admin/chatManagement")
                        ? activeClass
                        : inactiveClass
                        }`}>
                        <span >
                            <BsChatSquareHeartFill size={22}  />
                        </span>
                       Chats
                    </li>
                </Link>
                <Link to={"/admin/MessageManagement"}>
                    <li className={`${baseClass} ${isActive("/admin/MessageManagement")
                        ? activeClass
                        : inactiveClass
                        }`}>
                        <span >
                            <TiMessages size={22} />
                        </span>
                        Messages
                    </li>
                </Link>

               
                    <li
                    onClick={handleLogout} 
                    className={`${baseClass} ${isActive("")
                        ? activeClass
                        : inactiveClass
                        }`}>
                        <span >
                            <IoIosLogOut size={22} />
                        </span>
                        Logout
                    </li>
              
              
            </ul>
        </div>
    )
}




const AdminLayout = ({children }) => {
    const isAdmin = true;
    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }
    const [isMobile , setIsMobile] = useState(false)
    const handleMobile = ()=>{
        setIsMobile(!isMobile)
    } 
  return (
      <div className="flex h-full bg-slate-100 text-slate-800">
          <button
              onClick={() => setIsMobile(!isMobile)}
              className="sm:hidden fixed top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow"
          >
              {isMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
          {/* Desktop Sidebar */}
          <div className="hidden sm:block ">
<Sidebar/>
     </div>
          {/* Mobile small sidebar panel */}
          {isMobile && (
              <div className="sm:hidden">
                  <Sidebar />
              </div>
          )}

          <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-200">
              <Outlet />
     </div>

    </div>
  )
}

export default AdminLayout
