import React from 'react'
import moment from 'moment'
import { RxAvatar } from "react-icons/rx";
import { MdAlternateEmail } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CiFaceSmile } from "react-icons/ci";
const Profile = ({user}) => {

  return (
    <div className='flex items-center justify-center flex-col'>
          <Avatar className="h-28  w-28 mt-4 border border-gray-300 shadow-sm">
              {user?.avatar ? (
                  <AvatarImage src={user?.avatar?.url} alt={user?.name} />
              ) : (
                  <AvatarFallback>
                      <RxAvatar className="w-6 h-6 text-gray-400" />
                  </AvatarFallback>
              )}
          </Avatar>
          <ProfieCard heading={"Bio"} text={user?.bio} />
          <ProfieCard heading={"Username"} text={user?.username} icon={<MdAlternateEmail />}/>
          <ProfieCard heading={"name"} text={user?.name} icon={<CiFaceSmile />} />
          <ProfieCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} icon={<FaCalendarAlt />} />
    </div>
  )
}

const ProfieCard = ({text , icon , heading}) =>{
    return (
        
        <div className='mt-5 text-amber-300 font-bold flex items-center justify-center flex-col'>
            <div>
                {icon}
            </div>
<div>
    {text}
</div>
<div className='text-gray-400 '>
    {heading}
</div>
        </div>
    )
}

export default Profile
