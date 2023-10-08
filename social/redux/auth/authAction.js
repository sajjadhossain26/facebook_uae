import axios from 'axios';
import createToast from '../../src/utility/toast';

// user register
export const userRegister = (data, setInput, e, setRegister) => async (dispatch) => {

  try {
    console.log(data);
   await axios.post("/api/v1/user/register", data).then(res=> {
     createToast('User register successful!', 'success')
     setInput({
      first_name: "",
      sur_name: "", 
      emailorMobile:"",
      password:"",
      birth_date:"",
      birth_month:"",
      birth_year:"",
      gender: ""
    })
     e.target.reset()
     setRegister(false)
   }).catch(error => {
    console.log(
      "error", error
    );
   
   })
  } catch (error) {
    console.log(error);
  }
}