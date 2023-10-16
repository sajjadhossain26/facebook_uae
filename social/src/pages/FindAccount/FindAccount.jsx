import React, { useState } from 'react'
import ResetHeader from '../../components/ResetHeader/ResetHeader'
import Footer from '../../components/Footer/Footer'
import userIMG from '../../assets/images/user.png'
import { Link, useNavigate } from 'react-router-dom'
import Cookeis from 'js-cookie'
import avatar from '../../assets/images/avatar.png'
import { emailHide, mobileHide } from '../../utility/helper'

const FindAccount = () => {

  
const userData = JSON.parse(Cookeis.get('findUser')) ?? null
const navigate = useNavigate()

console.log(userData);
const handleNotYou = (e) => {
 e.preventDefault();
 Cookeis.remove('findUser')
 navigate('/forgot')

}


  // handle password reset link
  const handlePasswordResetLink = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/v1/user/send-password-reset", {
        auth: findUser.mobile ?? findUser.email,
      })
      .then((res) => {
        createToast(res.data.message, "success");
        navigate("/activation/reset-password");
      })
      .catch((error) => {
        createToast(error.response.data.message);
      });
  };


  return (
    <>
      <ResetHeader/>
      <div className="reset-area">
      <div className="reset-wraper">
        <div className="reset-box">
          <div className="reset-box-header">
            <span className="title">Reset your password</span>
          </div>
          <div className="reset-body">
            <div className="find-user-account">
              <img src={userData.photo? userData.photo :` ${avatar}`} alt="" />
              <span>{userData.name}</span>
              <p>{userData.email ?  `Email: ${emailHide(userData.email)}` : `Mobile: ${mobileHide(userData.mobile)}`}</p>

              <p>To reset your account password, please continue</p>
            </div>
          </div>
          <div className="reset-footer">
            <a href="#"></a>
            <div className="reset-btns">
              <a onClick={handleNotYou} className="cancel" href="#">Not you ?</a>
              <a className="continue" onClick={handlePasswordResetLink} href="#">Continue</a>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer/>
    </>
  )
}

export default FindAccount
