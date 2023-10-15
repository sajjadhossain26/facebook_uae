import React, { useState } from 'react'
import ResetHeader from '../../components/ResetHeader/ResetHeader'
import Footer from '../../components/Footer/Footer'
import { Link, useNavigate } from 'react-router-dom'
import createToast from '../../utility/toast'
import axios from 'axios'

const Forgot = () => {

  const [auth, setAuth] = useState('')
  const navigate = useNavigate()

  const handForgotAuth = (e) => {
     setAuth(e.target.value)
  }

  const handleSearchAccount = (e) => {
   e.preventDefault();
   if(!auth){
    createToast('All Fields are required', 'warn')
   }else{
     axios.post('/api/v1/user/find-account', {
      auth: auth
    }).then(res => {
      navigate('/find-account')
    }).catch((error) => {
      createToast(error.response.data.message)
    })

   
   }
  }
  return (
    <>

    <ResetHeader/>
    <div className="reset-area">
      <div className="reset-wraper">
        <div className="reset-box">
          <div className="reset-box-header">
            <span className="title">Find Your Account</span>
          </div>
          <div className="reset-body">
            <p>
              Please enter your email address or mobile number to search for
              your account.
            </p>
            <div className="code-box">
              <input
                className="w-100"
                type="text"
                value={auth}
                placeholder="Email address or mobile number"
                onChange={handForgotAuth}
              />
            </div>
          </div>
          <div className="reset-footer">
            <a href="#"></a>
            <div className="reset-btns">
              <Link to='/login' className="cancel" href="#">Cancel</Link>
              <a className="continue" type='submit' onClick={handleSearchAccount} href="#">Search</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
      
    </>
  )
}

export default Forgot
