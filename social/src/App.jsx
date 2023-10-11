import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import Auth from './pages/Auth/Auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Activation from './pages/Activation/Activation'
import Forgot from './pages/Forgot/Forgot'
import FindAccount from './pages/FindAccount/FindAccount'
import Password from './pages/Password/Password'

function App() {
  const [count, setCount] = useState(0)
  return (
  <>   
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/activation' element={<Activation/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/find-account' element={<FindAccount/>}/>
        <Route path='/new-password' element={<Password/>}/>
      </Routes>
  </>

  )
}

export default App
