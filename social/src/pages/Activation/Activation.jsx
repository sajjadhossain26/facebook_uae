import React, { useState } from 'react'
import FacebookLogo from '../../assets/icons/facebook.svg'
import Footer from '../../components/Footer/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { activationOtp, resendLink } from '../../../redux/auth/authAction'
import createToast from '../../utility/toast'

const Activation = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [activationCode, setActivationCode] = useState("")

    // Activation email
    const activationEmail = Cookie.get('otp')
    useEffect(() => {
        if(!activationEmail){
            navigate('/login')
         }
    })

    const handleActivationcancel = () => {
        Cookie.remove('otp')
        navigate('/login')
    }

    const handleCodeContinue =(e) => {
        
       e.preventDefault();
       if(!activationCode){
        createToast('Put otp code first', 'warn')
       }else{
        dispatch(activationOtp({code: activationCode, email: Cookie.get('otp')}, navigate))
       }
    }

    const handleResendLink =(e) => {
      e.preventDefault();
      dispatch(resendLink(activationEmail, navigate)) 
    }
  return (
    <>
       {/* <!-- Facebook Auth Area --> */}
    <div className="reset-header">
      <div className="reset-header-wraper">
        <div className="reset-logo">
          <img src={FacebookLogo} alt="" />
        </div>
        <div className="login-part">
          <input type="text"  placeholder="Email or mobile number" />
          <input type="text" placeholder="Password" />
          <button>Log In</button>
          <a href="#">Forgotten account?</a>
        </div>
      </div>
    </div>

    {/* <!-- reset Box  --> */}
    <div className="reset-area">
      <div className="reset-wraper">
        <div className="reset-box">
          <div className="reset-box-header">
            <span className="title">Enter security code</span>
          </div>
          <div className="reset-body">
            <p>
              Please check your emails for a message with your code. Your code
              is 6 numbers long.
            </p>
            <div className="code-box">
              <input type="text" value={activationCode} onChange={(e)=> setActivationCode(e.target.value)}/>
              <div className="code-text">
                <span>We sent your code to:</span>
                <span>{activationEmail}</span>
              </div>
            </div>
          </div>
          <div className="reset-footer">
            <a onClick={handleResendLink} href="#">Didn't get a code?</a>
            <div className="reset-btns">
              <a className="cancel" onClick={handleActivationcancel}>Cancel</a>
              <a className="continue" onClick={handleCodeContinue} href="#">Continue</a>
            </div>
          </div>
        </div>
      </div>
    </div>

   <Footer/>
    </>
  )
}

export default Activation
