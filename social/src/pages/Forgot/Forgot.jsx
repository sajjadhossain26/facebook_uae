import React from 'react'
import ResetHeader from '../../components/ResetHeader/ResetHeader'
import Footer from '../../components/Footer/Footer'
import { Link } from 'react-router-dom'

const Forgot = () => {
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
                placeholder="Email address or mobile number"
              />
            </div>
          </div>
          <div className="reset-footer">
            <a href="#"></a>
            <div className="reset-btns">
              <Link to='/login' className="cancel" href="#">Cancel</Link>
              <a className="continue" href="#">Search</a>
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
