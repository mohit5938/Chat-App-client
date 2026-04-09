import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from "react-toastify";
import { useInputValidation } from "6pp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IoCamera } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import {
    Card,

} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {server} from '../components/constants/config.js'

const AdminLogin = () => {
    const navigate = useNavigate();
 
    const formSchema = z.object({
      secretKey: z.string().min(4, 'secret Key must be at least 4 char'),
    })
  
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
          secretKey: '',
      },
    })

    const handleLogin = async(values) => {
      try {
          const { data } = await axios.post(`${server}/api/admin/adminLogin`, {
              secretKey: values.secretKey,
          }, {
              withCredentials: true,
          })

          if (data.success) {
              toast.success(data.message)
              navigate('/admin')
          }
          else {
              toast.error(data.message)
          }
      } catch (error) {
        console.log(error)
          toast.error(error?.response?.data?.message || error.message);
      }
    }
    

    return (
       
    <div>

         
            <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 via-green-400 to-yellow-500">
                <div onClick={() => navigate('/')} className='absolute top-4 left-6   cursor-pointer font-extrabold text-blue-600'>
                    <h1>MSCA</h1>

                </div>
              <Card className="w-1/2 max-w-md shadow-lg" >
                  
                      <div className="flex justify-center items-center  flex-col">
                          <h1 className='font-extrabold mb-4 text-lime-600'>Admin login</h1>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                               


                                  <div className="mb-3">
                                      <FormField
                                          control={form.control}
                                        name="secretKey"
                                          render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel>SECRET-KEY</FormLabel>
                                                  <FormControl>
                                                      <Input type="password" placeholder="enter your secret-key" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                              </FormItem>
                                          )}
                                      />
                                  </div>

                                  <div className='m-2 '>
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                    </div>
                              </form>
                          </Form>
                      </div>
              </Card>
          </div>
    </div>
  )
}

export default AdminLogin
