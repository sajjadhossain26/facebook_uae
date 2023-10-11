import axios from 'axios';
import createToast from '../../src/utility/toast';
import { REGISTER_FAILED, REGISTER_REQUEST, REGISTER_SUCCESS } from './actionType';


// user register
export const userRegister = (data, setInput, e, setRegister, navigate) => async (dispatch) => {

  try {
    dispatch({
      type: REGISTER_REQUEST,
    })
   await axios.post("/api/v1/user/register", data).then(res=> {
     createToast('User register successful!', 'success')
     dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.message
    })
     setInput({
      first_name: "",
      sur_name: "", 
      auth:"",
      password:"",
      birth_date:"",
      birth_month:"",
      birth_year:"",
      gender: ""
    })
     e.target.reset()
     setRegister(false)
     navigate('/activation')
   }).catch(error => {
    createToast(error.response.data.message);
      
    dispatch({
      type: REGISTER_FAILED,
      payload: error.response.data
    })
   
   })
  } catch (error) {
    createToast(error.response.data.message);
    dispatch({
      type: REGISTER_FAILED,
      payload: error.response.data
    })
  }
}

// user account activation by otp
export const activationOtp = ({code, email}, navigate) => async (dispatch) => {
  try {

     axios.post('/api/v1/user/activation_code', {
      code: code,
      email: email
    }).then(res=> {
      createToast('Account activate successful', 'success')
      navigate('/login')
    }).catch(error => {
      createToast(error.response.data.message);
    })
    
  } catch (error) {
    createToast(error.response.data.message);
    
  }
}


// resend activation by otp
export const resendLink = (email, navigate) => async (dispatch) => {
  try {

     axios.post('/api/v1/user/resend_activate', {
      email: email,
    }).then(res=> {
      createToast(res.data.message, 'success')
      
    }).catch(error => {
      createToast(error.response.data.message);
    })
    
  } catch (error) {
    createToast(error.response.data.message);
    
  }
}