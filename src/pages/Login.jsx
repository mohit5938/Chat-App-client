import React from 'react'
import { useState } from 'react'
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
import { server } from '../components/constants/config.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { toast } from "react-toastify";
import GoogleLogin from '../components/shared/GoogleAuth.jsx'
import { userNotExists, userExists } from '../redux/reducers/auth'
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
import SimpleLoader from "../components/shared/ShimmerLoader/LoginLoader.jsx"

const Login = () => {

  const [islogin, setisLogin] = useState(true);
  const [preview, setPreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const registerSchema = z.object({
    username: z.string().min(3, "Username must be 3 characters"),
    name: z.string().min(3, "Name must be 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    bio: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(islogin ? loginSchema : registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      bio: "",
    },
  });


  const dispatch = useDispatch();

  const handelLogin = async (value) => {

    setLoading(true)
    try {

      const { email, password } = value;
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
      

      
      const { data } = await axios.post(`${server}/api/user/login`,
        {
          email: email,
          password: password,
        } ,
        config
      );
      if( ! data.success ){
      toast.error(data.message)
      }
      dispatch(userExists(data.user))
      navigate("/")
      toast.success(data.message)

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    
    }
    finally {
      setLoading(false);
    }
  }

  const handelSignUp = async (values) => {
   setLoading(true)
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("bio", values.bio);
      if (!avatar) {
        return toast.error("Please upload an avatar");
      }
      formData.append("avatar", avatar);

      const { data } = await axios.post(
        `${server}/api/user/register`,
        formData,
        { withCredentials: true }
      );

      toast.success(data.message);
      form.reset();
      setisLogin(true)
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen 
bg-gradient-to-br from-teal-50 via-white to-cyan-100">
      {loading ? (<SimpleLoader/>) : (
       <Card className="w-1/2 max-w-md shadow-lg" >
        {
          islogin ? <div className="flex justify-center items-center  flex-col">
            <h1 className='font-extrabold mb-4 text-lime-600'>login</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handelLogin)} className="space-y-8">
                  <div className='mb-2 '>
                    <GoogleLogin />
                    <div className='border-2 my-5 flex items-center justify-center'>
                      <span className='absolute'>
                        Or
                      </span>
                    </div>
                  </div>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='m-2 '>
                  <Button type="submit" className="w-full">login</Button>
                  <div className='mt-5 text-sm flex justify-center items-center gap-2'>
                    <p>Don&apos;t have account:?</p>
                    <p
                      onClick={() => setisLogin(prev => !prev)}
                      className="text-blue-500 underline cursor-pointer"
                    >
                      Sign up
                    </p>


                  </div>
                </div>
              </form>
            </Form>
          </div >

            :
<div className="flex justify-center items-center  flex-col">
  <h1 className='font-extrabold mb-4 text-lime-600'>Sign In</h1>
  <div className="relative flex flex-col items-center justify-center">
    {/* Avatar */}
    <Avatar className="w-28 h-28 border-2 border-gray-300">
      {preview ? (
        <AvatarImage src={preview} alt="User Avatar" />
      ) : (
        <AvatarFallback>
          <FaUserCircle className="w-20 h-20 text-gray-400" />
        </AvatarFallback>
      )}
    </Avatar>

    {/* Camera icon as label */}
    <label
      htmlFor="avatar"
      className="absolute bottom-1 right-1 bg-gray-200 p-2 rounded-full cursor-pointer hover:bg-gray-300 transition"
    >
      <IoCamera className="w-5 h-5 text-gray-700" />
    </label>

    {/* Hidden file input */}
    <input
      id="avatar"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatar(file);
        setPreview(URL.createObjectURL(file));
      }}
    />
  </div>




  <Form {...form}>
    <form onSubmit={form.handleSubmit(handelSignUp)} className="space-y-8">

                    <div className='mb-2 mt-2 '>
                      <GoogleLogin />
                      <div className='border-2 my-5 flex items-center justify-center'>
                        <span className='absolute'>
                          Or
                        </span>
                      </div>
                    </div>

      <div className='mb-3'>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='mb-3'>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserName</FormLabel>
              <FormControl>
                <Input type="text" placeholder="enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mb-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mb-3">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='mb-3'>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input type="text" placeholder="enter your bio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='m-2 '>
        <Button type="submit" className="w-full">Sign</Button>
        <div className='mt-5 text-sm flex justify-center items-center gap-2'>
          <p>Already have account:?</p>
          <p
            onClick={() => setisLogin(prev => !prev)}
            className="text-blue-500 underline cursor-pointer"
          >
            Login
          </p>


        </div>
                   
      </div>
    </form>
  </Form>
</div>
        }

      </Card >
     )}
    </div>

  )
}

export default Login
