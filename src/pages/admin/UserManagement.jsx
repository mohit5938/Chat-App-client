import React,{useState,useEffect} from 'react'
import Table  from "@/components/shared/Table.jsx"
import axios from 'axios'
import {server} from '@/components/constants/config.js'
import { DashboardUserData } from '@/components/constants/sample.js'
const columns = [
  { key: "id", label: "ID" },
  {
    key: "avatar",
    label: "Avatar",
    render: (user) => (
      <img
        src={user.avatar}
        alt={user.name}
        className="h-8 w-8 rounded-full"
      />
    ),
  },
  { key: "name", label: "Name" },
  { key: "username", label: "Username" },
  { key: "friends", label: "Friends", align: "center" },
  { key: "groups", label: "Groups", align: "center" },
  {
    key: "createdAt",
    label: "Created At",
    render: (u) => new Date(u.createdAt).toLocaleDateString(),
  },
]

const UserManagement = () => {



  const [rows , setRows] = useState([])

  useEffect(() => {
const handelUserData = async() => {
try {
  const { data } = await axios.get(`${server}/api/admin/users`,{
    withCredentials: true,
  })

  if (data.success) {
    const formattedData = data.users.map((user) => ({
      id: user._id,              // 🔥 important
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      groups: user.groups,
      friends: user.friends,
      createdAt: user.createdAt,
    }));

    setRows(formattedData); 
  }

} catch (error) {
  console.error(error);
}
} 
    handelUserData()
  },[])
  useEffect(()=>{
setRows(DashboardUserData.users.map((i)=>(
{
  ...i,id:i._id
}
)))
  },[])
  return (
    <div className=' h-[100vh]'>
      <Table heading={"All Users"} column={columns} row={rows} pageSize={5} />
    </div>
  )
}

export default UserManagement
