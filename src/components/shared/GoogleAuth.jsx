import React from 'react'
import { FcGoogle } from "react-icons/fc";
import {signInWithPopup} from 'firebase/auth'
import {auth,provider} from '@/firebaseconfig.js'
import {toast} from 'react-toastify'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import {  useNavigate } from 'react-router-dom'
import {  userExists } from '@/redux/reducers/auth.js'
import {server} from '../constants/config.js'
const GoogleLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handelLogin = async()=>{
        
        try {
    const googleResponse = await signInWithPopup(auth,provider)
    const user = googleResponse.user   
    const bodyData = {
        name:user.displayName,
        username:user.displayName + "&&",
        email:user.email,
        avatar:user.photoURL
    }
    console.log(user)
            const { data } = await axios.post(`${server}/api/user/googleLogin`,
                bodyData,
        { withCredentials: true }
            )



            if (!data.success) {
                toast.error(data.message)
                return;
            }
            dispatch(userExists(data.user))
            toast.success("user login")
            navigate('/')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
}
  return (

      <button variant='outline' className="w-full" onClick={handelLogin} >
              <FcGoogle />
Continue With Google
      </button>
  
  )
}

export default GoogleLogin
