import React, { useState } from 'react'
import crossBtn from "../assets/icons/cross.png";
import createToast from '../utility/toast';

    //  day
    let day = [];
    for(let i = 1; i <=31; i++ ){
        day.push(i)
        console.log(day);
    }
    // Month of registration
    const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];


    // year
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);


const Register = ({setRegister}) => {

    const [input, setInput] = useState({
        first_name: "",
        sur_name: "", 
        emailorMobile:"",
        password:"",
        day:"",
        month:"",
        year:"",
        gender: ""
    })

     
    const [validate, setValidate] = useState({
        first_name: false,
        sur_name: false ,
        emailorMobile: false,
        password: false,
    })  
    // input state update
    const handleInputChange = (e) => {
       const fieldName = e.target;

        setInput((prevState) => ({
            ...prevState, 
            [e.target.name]: e.target.value
        }))

        if(!e.target.value){
            fieldName.classList.add('red-border')
           }else{
            fieldName.classList.remove('red-border')
           }
    }

    // handle input validate
    const handleInputValidate = (e) => {
       const fieldName = e.target;

       if(!e.target.value){
        fieldName.classList.add('red-border')
       }else{
        fieldName.classList.remove('red-border')
       }
      
    }

    // handle register
    const handleRegister = (e) => {
          e.preventDefault()

          if(!input.first_name || !input.sur_name || !input.password || !input.emailorMobile || !input.gender){
            createToast('All Fields are required!')
          }
    }
    

  return (
    <>
     {/* <!-- MODAL BOX  --> */}
     <div className="blur-box">
      <div className="sign-up-card">
        <div className="sign-up-header">
          <div className="sign-up-content">
            <span>Sign Up</span>
            <span>It's quick and easy.</span>
          </div>
          <button onClick={()=>setRegister(false)}><img src={crossBtn} alt="" /></button>
        </div>
        <div className="sign-up-body">
          <form onSubmit={handleRegister}>
          {/* {
                validate.first_name || validate.sur_name || validate.emailorMobile || validate.password &&  <p style={{color: "red"}}>All field are required</p>
            } */}
            <div className="reg-form reg-form-inline">
              <input type="text" className="" value={input.first_name} onChange={handleInputChange}  name="first_name" placeholder="First Name" onBlur={handleInputValidate}/>
              <input type="text "   value={input.sur_name}  onChange={handleInputChange} name="sur_name" placeholder="Surname" onBlur={handleInputValidate}/>

            </div>
            
            <div className="reg-form">
              <input type="text"  className="" value={input.emailorMobile}  onChange={handleInputChange} name="emailorMobile" placeholder="Mobile number or email address" onBlur={handleInputValidate}/>
            </div>
            <div className="reg-form">
              <input type="text"  className="" value={input.password}  onChange={handleInputChange} name='password' placeholder="New password" onBlur={handleInputValidate}/>
            </div>
            <div className="reg-form">
              <span>Date of birth</span>
              <div className="reg-form-select">
                <select name="" id=""  onChange={handleInputChange}>
                  {
                    day.map((item, index) => (
                        <option value={item} key={index}>{item}</option>
                    ))
                  }
                </select>
                <select name="" id=""  onChange={handleInputChange}>
                    {
                        month.map((item, index) => (
                           <option value={item} key={index}>{item}</option>
                        ))
                    }
                </select>
                <select name="" id=""  onChange={handleInputChange}> 
                    {
                        years.map((item, index) => (

                            <option value={item} key={index}>{item}</option>
                        ))
                    }
                </select>
              </div>
            </div>

            <div className="reg-form">
              <span>Gender</span>
              <div className="reg-form-select">
                <label>
                  Female
                  <input type="radio" name="gender" onChange={handleInputChange} value="Female"/>
                </label>
                <label>
                  Male
                  <input type="radio" name="gender"  onChange={handleInputChange} value="Male"/>
                </label>

                <label>
                  Custom
                  <input type="radio" name="gender" onChange={handleInputChange} value="Custom"/>
                </label>
              </div>
            </div>

            <div className="reg-form">
              <p>
                People who use our service may have uploaded your contact
                information to Facebook. <a href="#">Learn more.</a>
              </p>
            </div>
            <div className="reg-form">
              <p>
                By clicking Sign Up, you agree to our <a href="#">Terms</a>,
                <a href="#">Privacy Policy</a> and
                <a href="#">Cookies Policy</a>. You may receive SMS
                notifications from us and can opt out at any time.
              </p>
            </div>

            <div className="reg-form">
              <button>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Register
