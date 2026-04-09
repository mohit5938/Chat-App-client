import React from 'react'
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";

import { useNavigate } from 'react-router-dom';
const Home = () => {
  return (
    <div className=" h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 ">

    <div className="text-center mb-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-wide">
        ChatConnect
      </h1>
      <p className="text-gray-700 text-lg mt-2">
        Connect • Chat • Share Moments
      </p>
    </div>


      <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-md text-center">

        <div className="flex justify-center">
          <MessageCircle className="h-14 w-14 text-blue-600" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Real-Time Messaging
        </h2>
        <p className="text-gray-500 mt-1">
          Chat with your friends instantly ...
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <Button className="w-full text-lg py-5">
            <Users className="mr-2 h-5 w-5" /> Select friend to Start Chatting
          </Button>

        
        </div>
      </div>

    </div>
  
  )
}

export default Home
