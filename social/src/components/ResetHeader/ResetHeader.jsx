import React from "react";
import FacebookLogo from '../../assets/icons/facebook.svg'


const ResetHeader = () => {
  return (
    <>
      <div className="reset-header">
        <div className="reset-header-wraper">
          <div className="reset-logo">
            <img src={FacebookLogo} alt="" />
          </div>
          <div className="login-part">
            <input type="text" placeholder="Email or mobile number" />
            <input type="text" placeholder="Password" />
            <button>Log In</button>
            <a href="#">Forgotten account?</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetHeader;
