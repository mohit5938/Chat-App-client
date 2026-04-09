import React from 'react'
import moment from "moment";
import { toast } from "react-toastify";
import axios from 'axios'
import {server} from '@/components/constants/config.js'
import {useState , useEffect} from 'react';
import { FaUserGroup } from "react-icons/fa6";
import { IoIosChatboxes } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { Linechart, Doughnutchart } from '@/components/specific/chart.jsx'
import {
      Card,
      CardAction,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
} from "@/components/ui/card"
const Dashboard = () => {
      const currentDateTime = moment().format("DD-MM-YYYY");
      const [stats, setStats] = useState({
            groupCount: 0,
            individualChatsCount:0,
            usersCount: 0,
            messageCount: 0,
            totalChatCount: 0,
      });

      const [ messages, setMessages] = useState([]);

      useEffect(()=>{
            const fetchDashboardData = async() => {
                 try {
                       const { data } = await axios.get(`${server}/api/admin/stats`, {

                       }, {
                             withCredentials: true,
                       })

                    
                      if( data.success){
                            setMessages(data.messages);
                            setStats(data.stats)
                      }
                      
                 } catch (error) {
                  console.log(error)
                 }
            }
            fetchDashboardData()
      },[])

  return (
    
   <div className='w-full h-full'>
     {/* //Header */}
      <div className='flex items-center justify-between'>
                  
            <div className='hidden sm:block font-extrabold '>
                  <div className='flex items-center gap-2'>
{currentDateTime}
                              <IoMdNotifications />
                  </div>

                              

            </div>
                  
      </div>
{/* //main section */}
              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6'>
            {/* //linechart */}
<div className='w-full h-full'>
                          <Card className="w-full  md:col-span-2">
                                <CardHeader>
                                      <CardTitle>last Messages</CardTitle>
                                    
                                </CardHeader>
                                <CardContent className="w-full">
                                      <Linechart value={messages}/>
                                </CardContent>
                                <CardFooter className="flex-col gap-2">
                                     
                                </CardFooter>
                          </Card>          
</div >
{/* //doughnut */}
                    <div className='w-full h-full' >
                          <Card className="w-full py-3">
                                <CardHeader>
                                      <CardTitle> chat vs group-chart</CardTitle>

                                </CardHeader>
                                <CardContent className="w-full flex items-center justify-center  ">
                                      <Doughnutchart value={[stats?.individualChatsCount, stats?.groupCount]}/>
                                </CardContent>
                                <CardFooter className="flex-col gap-2">

                                </CardFooter>
                          </Card>
</div>
{/* //threeboxs */}
                 

      </div>
              <div className='w-full  mt-2 flex items-center gap-4.5'>
                    <Card className="m-1 py-2 px-2 w-full  ">
                          <CardHeader>
                                <CardTitle className="text-indigo-600">
                                      <IoIosChatboxes size={stats?.totalChatCount}  />
                                    Chats</CardTitle>

                          </CardHeader>
                          <CardContent>
203
                          </CardContent>
                          <CardFooter className="flex-col gap-2">

                          </CardFooter>
                    </Card>
                    <Card className="w-full m-1 py-2 px-2 ">
                          <CardHeader>
                                <CardTitle className="text-indigo-600">
                                      <FaUserGroup size={22} />
                                    Groups
                                    </CardTitle>

                          </CardHeader>
                          <CardContent>
                                {stats?.groupCount}
                          </CardContent>
                          <CardFooter className="flex-col gap-2">

                          </CardFooter>
                    </Card>
                    <Card className="w-full m-1 py-2 px-2  ">
                          <CardHeader>
                                <CardTitle className="text-indigo-600">
                                      <FaUser size={22}/>
                                    users</CardTitle>

                          </CardHeader>
                          <CardContent>
                                {stats?.usersCount}
                          </CardContent>
                          <CardFooter className="">

                          </CardFooter>
                    </Card>

              </div>
      
   </div>
   
             
    
  )
}

export default Dashboard
