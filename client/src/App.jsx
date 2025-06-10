import React, { children, useEffect, useState } from 'react'
import { Await, BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { GET_USER_INFO } from './utils/constant'
import { apiClient } from './lib/api-client'
// import { set } from 'mongoose'


const PrivateRoute = ({children})=>{
  const {userInfo , se} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/>
}
  
const AuthRoutes = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ?  <Navigate to="/chat"/> : children;
}
const App = () => {
  const { userInfo , setUserInfo} = useAppStore();
  const [loading , setLoading] = useState(true)
  
  useEffect(() =>{ 
    const getUserData = async () =>{
      try {
        const response = await apiClient.get(GET_USER_INFO,{
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log({response});
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };
    if(!userInfo){
      getUserData();
    }else{
      setLoading(false);
    }
    
  },[userInfo, setUserInfo]);

  if (loading){
    return <div> Loading......</div>
  }

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoutes>
          <Auth/>
        </AuthRoutes>} />
        <Route path="/chat" element={<PrivateRoute>
          <Chat />
        </PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute>
          <Profile />
        </PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
        
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App