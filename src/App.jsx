import React, { lazy } from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectRoute from './components/auth/ProtectRoute.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
const Home = lazy(() => import("./pages/Home.jsx"))
const Chat = lazy(() => import("./pages/Chat.jsx"))
const Group = lazy(() => import("./pages/Group.jsx"))
const Login = lazy(() => import("./pages/Login.jsx"))
const NotFound = lazy(() => import("./pages/NotFound.jsx"))
const Notification = lazy(() => import("./components/specific/Notification.jsx"))
const NewGroup = lazy(() => import("./components/specific/NewGroup.jsx"))
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"))
const Dashboard = lazy(() => import('../src/pages/admin/Dashboard.jsx'))
const UserManagement = lazy(() => import('../src/pages/admin/UserManagement.jsx'))
const ChatManagement = lazy(() => import('../src/pages/admin/ChatManagement.jsx'))
const MessageManagement = lazy(() => import('../src/pages/admin/MessageManagement.jsx'))
import AdminLayout from '../src/components/layout/AdminLayout.jsx'
import axios from 'axios'
import { server } from './components/constants/config.js'
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {userNotExists , userExists } from './redux/reducers/auth.js'
import { SocketProvider } from './util/Socket.jsx'
const App = () => {
  const { user, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/api/user/getUser`, {
      withCredentials: true
    })
      .then((res) => {
        dispatch(userExists(res.data.user));
      })
      .catch(() => {
        dispatch(userNotExists());
      });
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <SocketProvider>
      <Routes>

        <Route element={<AppLayout />}>
          <Route element={
            <ProtectRoute user={user} />
         }>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/Group' element={<Group />} />
            <Route path='/Notification' element={<Notification />} />
            <Route path='/newGroup' element={<NewGroup />} />

          </Route>

         
        </Route>
        <Route path='/login' element={
          <ProtectRoute user={!user} redirect='/'>
            <Login />
          </ProtectRoute>}
        />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>

          <Route path="/admin/Dashboard" element={<Dashboard />} />
          <Route path="/admin/userManagement" element={<UserManagement />} />
          <Route path="/admin/messageManagement" element={<MessageManagement />} />
          <Route path="/admin/chatManagement" element={<ChatManagement />} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </SocketProvider>
    </Router>
  )
}

export default App
