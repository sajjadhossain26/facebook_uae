import React from 'react'
import ResetHeader from '../../components/ResetHeader/ResetHeader'
import Footer from '../../components/Footer/Footer'
import userIMG from '../../assets/images/user.png'

const FindAccount = () => {
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
              <img src={userIMG} alt="" />
              <span>Asraful Haque</span>
              <p>To reset your account password, please continue</p>
            </div>
          </div>
          <div className="reset-footer">
            <a href="#"></a>
            <div className="reset-btns">
              <Link to="/login" className="cancel" href="#">Not you ?</Link>
              <a className="continue" href="#">Continue</a>
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
