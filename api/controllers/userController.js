import { LogOutput } from 'concurrently';
import User from '../models/User.js'
import createError from '../utility/createError.js'
import { hashPassword, passwordVerify } from '../utility/hash.js';
import { mathRandom } from '../utility/math.js';
import { sendActivationLink, sendPasswordForgotLink } from '../utility/sendMail.js';
import { createToken, tokenVerify } from '../utility/token.js';
import { isEmail } from '../utility/valiDate.js';





/**
 * @access public
 * @method GET
 * @route api/user
 */

export const register =async (req, res, next) => {
  try {
    const {first_name, sur_name, email, password, birth_date, birth_month, birth_year, gender} = req.body;

    // validation
    if(!first_name || !sur_name || !email || !password || !gender ){
      next(createError(404, "All Fields are required!"))
    }

    if(!isEmail(email)){
      next(createError(400, "Invalid Email Address!"))
    }

    const emailUser = await User.findOne({email: email});
    if(emailUser){
     return next(createError(400, "Email already exist"));
    }
  // activation code 

   let activationCode = mathRandom(10000, 99999)

  // check activation
  const checkActivation = await User.findOne({access_token: activationCode})  
  if(checkActivation){
    activationCode = mathRandom(10000, 99999)
  }

    const user = await User.create({
      first_name, sur_name, email, password: hashPassword(password), birth_date, birth_month, birth_year, gender, access_token: activationCode
    })

 

    if(user){
    const activationToken = createToken({id: user._id}, '30d')
 
    sendActivationLink(user.email, {
      name: user.first_name,
      link:`${process.env.APP_URL +':'+ process.env.SERVER_PORT }/api/v1/user/activate/${activationToken}`,
      code: activationCode
    })
    
      res.status(200).cookie("otp", user.email, {
        expires: new Date(Date.now() + 1000 * 60 *15)
      }).json({
        message: 'Registration successfull!',
        user: user,
      })
    }
  } catch (error) {
     next(error)
  }
}




/**
 * @access public
 * @method GET
 * @route api/user
 */

export const login =async (req, res, next) => {
  try {
    const {email, password} = req.body;

    // validation
    if(!email || !password ){
       
      next(createError(400, "All Fields are required!"))
    }
    if(!isEmail(email)){
      next(createError(400, "Invalid Email Address!"))
    }
    const loggedinUser = await User.findOne({email: email});
    if(!loggedinUser){
      next(createError(400, "User not found!"));
    }else{
      if(!passwordVerify(password, loggedinUser.password)){
        next(createError(400, "Password not match"))
      }else{
   
        const token = createToken ({id: loggedinUser._id}, '365d')
        res.status(200).cookie('auth_token', token).json({
          message: 'User login successfull!',
          user: loggedinUser,
          token: token
        })
      }
      
    }

  } catch (error) {
    next(error)
  }
}






/**
 * @access public
 * @method GET
 * @route api/v1/user/
 */

export const loggedInUser =async (req, res, next) => {
  const auth_token = req.headers.authorization;
  try {
    if(!auth_token){
      next(createError(400, "Token not found"))
    }
    if(auth_token){
      const token = auth_token.split(' ')[1];
      const user = tokenVerify(token)

      if(!user){
        createError(400, "Token invalid")
      }

      if(user){
        const loggedUser =await User.findById(user.id)
        if(!loggedUser){
          next(createError(404, "User not found!"))
        }else{
          res.status(400).json({
            message: 'User data stable',
            user: loggedUser
          })
        }
      
      }
    }
  } catch (error) {
    next(error)
  }
}






/**
 * Account activation by email
 */

export const activateAccount =async (req, res, next) => {
  try {

    const {token} = req.params

    if(!token){
      next(createError(400, 'Token not found'))
    }
    const tokenData = tokenVerify(token)

    // check token 
    if(!tokenData){
      next(createError(400, "Activation invalid!"))
    }
 

    if(tokenData){
      const account = await User.findById(tokenData.id);

      if(account.isActivate == true) {
        next(createError(400, 'Account already activated'))
      }else{
        await User.findByIdAndUpdate(tokenData.id, {
          isActivate: true,
          access_token: ''
        })
        res.status(200).json({
          message: "Account activation successful!"
        })
      }
      
    }

    
  } catch (error) {
    next(error)
  }
}




/**
 * Account activate by code
 */

export const activateAccountByCode = async (req, res, next) => {
  try {
    const {code} = req.body;
   const user = await User.findOne().and([{access_token: code}, {isActivate: false}])
   if(!user){
    next(createError(400, "Activation user not found"))
   }
   if(user){
    await User.findByIdAndUpdate(user.id,{
      isActivate: true,
      access_token: ''
    })

    res.status(400).json({
      message: 'Account activation successful!'
    })
   }
  } catch (error) {
    next(error)
  }
}





/**
 * Forgot password
 */

export const forgotPassword =async (req, res, next) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email: email})

    if(!user){
      next(createError(404, 'User not found'))
    }
    

    // Forgot Password code
    let activationCode = mathRandom(10000, 99999)

   // check code
   const checkActivation = await User.findOne({access_token: activationCode})  
   if(checkActivation){
     activationCode = mathRandom(10000, 99999)
   }

   
    if(user){
      const forgotPasswordLink = createToken({id: user._id}, '30d')
 
    sendPasswordForgotLink(user.email, {
      name: user.first_name,
      link:`${process.env.APP_URL +':'+ process.env.SERVER_PORT }/api/v1/user/forgot-password/${forgotPasswordLink}`,
      code: activationCode
    })

    await User.findByIdAndUpdate(user._id, {
      access_token: activationCode
    })
    
      res.status(200).json({
        message: 'Password reset link has been sent',
      })
    }

  } catch (error) {
    next(error)
  }
}




/**
 * Pasword reset
 */

export const passwordResetAction =async (req, res, next) => {
  try {

    const {token} = req.params;
    const {password} = req.body

    if(!token){
      next(createError(400, 'Invalid password reset url'))
    }
    const tokenData = tokenVerify(token)

    // check token 
    if(!tokenData){
      next(createError(400, "invalid reset link!"))
    }
 

    if(tokenData){
      const user = await User.findById(tokenData.id);

      if(!user){
        next(createError(400, "Invalid user id"))
      }

      if(user){
        await User.findByIdAndUpdate(user._id, {
          password: hashPassword(password),
          access_token: ''
        })
      }

      res.status(200).json({
        message: "Password change succesfull!"
      })
    }

    
  } catch (error) {
    next(error)
  }
}