import { LogOutput } from 'concurrently';
import User from '../models/User.js'
import createError from '../utility/createError.js'
import { hashPassword, passwordVerify } from '../utility/hash.js';
import { mathRandom } from '../utility/math.js';
import { sendActivationLink, sendPasswordForgotLink } from '../utility/sendMail.js';
import { createToken, tokenVerify } from '../utility/token.js';
import { isEmail, isMobile } from '../utility/valiDate.js';
import { sendOtp } from '../utility/sendSMS.js';





/**
 * @access public
 * @method GET
 * @route api/user
 */

export const register =async (req, res, next) => {
  try {
    const {first_name, sur_name, auth, password, birth_date, birth_month, birth_year, gender} = req.body;

    // validation
    if(!first_name || !sur_name || !auth || !password || !gender ){
      next(createError(404, "All Fields are required!"))
    }
    
    // initial auth value
    let mobileData = null;
    let emailData = null;
   
    
    if(isEmail(auth)){
       emailData = auth;
       const emailUser = await User.findOne({email: emailData});
       if(emailUser){
        return next(createError(400, 'Email Already exist'))
       }
    }else if(isMobile(auth)){
       mobileData = auth;
       const mobileUser = await User.findOne({mobile: mobileData});
       if(mobileUser){

         return next(createError(400, 'Mobile Number already axist'))
       }
    }else{
      next(createError(400, 'Invalid mobile or email'))
    }
   
  // activation code 

   let activationCode = mathRandom(10000, 99999)

  // check activation
  const checkActivation = await User.findOne({access_token: activationCode})  
  if(checkActivation){
    activationCode = mathRandom(10000, 99999)
  }

    const user = await User.create({
      first_name, sur_name, email: emailData, mobile: mobileData, password: hashPassword(password), birth_date, birth_month, birth_year, gender, access_token: activationCode
    })

 

    if(user){
      if(emailData){
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
      if(mobileData){
        sendOtp(user.mobile, `Hi, ${user.first_name}, Your account activation otp is ${activationCode}`)
        
          res.status(200).cookie("otp", user.mobile, {
            expires: new Date(Date.now() + 1000 * 60 *15)
          }).json({
            message: 'Registration successfull!',
            user: user,
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
 * @route /api/user/resend-activation
 * @route POST
 */

export const resendActivation =async (req, res, next) => {

  const {auth} = req.body;
  let mobileData = null;
  let emailData = null;
  let emailCheck;
  let mobileCheck;


  
  if(isEmail(auth)){
    emailData = auth;

    emailCheck = await User.findOne({email: emailData});
    if(!emailCheck){
      return next(createError(404, "Email User not found"))
    }
    if(emailCheck.isActivate){
      return next(createError(404, "User already activated"))
    }
  }else if(isMobile(auth)){
    mobileData= auth;
    mobileCheck = await User.findOne({mobile: mobileData})

    if(!mobileCheck){
      return next(createError(404, "Mobile user not found"))
    }
    if(mobileCheck.isActivate){
      return next(createError(404, "User alredy activated by email"))
    }
  }else {
    return next(createError(404, "Invalid email or mobile"));
  }

  try {
    // activation code 
    let activationCode = mathRandom(10000, 99999)
  // check activation
  const checkActivation = await User.findOne({access_token: activationCode})  
  if(checkActivation){
    activationCode = mathRandom(10000, 99999)
  }

    if(mobileData){
      sendOtp(mobileCheck.mobile, `Hi, ${mobileCheck.first_name}, Your account activation otp is ${activationCode}`)

      // update link 
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activationCode
      })
        
      res.status(200).cookie("otp", mobileCheck.mobile, {
        expires: new Date(Date.now() + 1000 * 60 *15)
      }).json({
        message: 'New OTP code send',
        user: mobileCheck,
      })
    }


    if(emailData){
    const activationToken = createToken({id: emailUser._id}, '30d')

      const emailUser =await User.findOne({ email: auth});

      if(!emailUser){
        createError(400, 'Invalid Link request')
      }

      if(emailUser){
     
      sendActivationLink(emailUser.email, {
        name: emailUser.first_name,
        link:`${process.env.APP_URL +':'+ process.env.SERVER_PORT }/api/v1/user/activate/${activationToken}`,
        code: activationCode
      })

      // update new link
      await User.findByIdAndUpdate(emailUser._id, {
        access_token: activationCode
      })
      
        res.status(200).cookie("otp", emailUser.email, {
          expires: new Date(Date.now() + 1000 * 60 *15)
        }).json({
          message: 'New activation link has been send',
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
    const {code, email} = req.body;
   const user = await User.findOne().or([{email: email}, {mobile: email}])
   if(!user){
    next(createError(404, "Activation user not found"))
   }

   if(user.isActivate == true){
    next(createError(404, "User alredy activated!"))
   }else if(user.access_token != code){
    next(createError(404, 'OTP Code not match'))
   }else{
    await User.findByIdAndUpdate(user.id,{
      isActivate: true,
      access_token: ''
    })

    res.status(200).json({
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


/**
 * find account
 */

export const findAccount = async (req, res, next) => {
  const {auth} = req.body;

  try {
     // initial auth value
   let mobileData = null;
   let emailData = null;
  
   
   if(isEmail(auth)){
      emailData = auth;
      const emailUser = await User.findOne({email: emailData});
      if(!emailUser){
        return next(createError(400, 'Email User does not exist'))
      }
      if(emailUser){
        res.status(200).cookie('findUser', JSON.stringify({
          name: emailUser.first_name,
          email: emailUser.email,
          photo: emailUser.photo
        }), {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        }).json({
          user: emailUser
        })
       }
   }else if(isMobile(auth)){
      mobileData = auth;
      const mobileUser = await User.findOne({mobile: mobileData});
      if(!mobileUser){
        return next(createError(400, 'Mobile user does not exist'))
      }
      if(mobileUser){
        res.status(200).cookie('findUser', JSON.stringify({
          name: mobileUser.first_name,
          mobile: mobileUser.mobile,
          photo: mobileUser.photo
        }), {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        }).json({
          user: mobileUser
        })
       }
   }else{
    return next(createError(400, "Invalid Mobile or Email"))
   }
  } catch (error) {
    next(error)
  }
}


/**
 * Send password reset otp link
 */

export const sendPasswordResetOTP = async (req, res, next) => {

  const { auth } = req.body;

  try {
    let mobileData = null;
    let emailData = null;
    let mobileCheck;
    let emailCheck;

    if (isEmail(auth)) {
      emailData = auth;

      emailCheck = await User.findOne({ email: auth });
    } else if (isMobile(auth)) {
      mobileData = auth;
      mobileCheck = await User.findOne({ mobile: auth });
    } else {
      return next(createError(404, "Invalid email or mobile"));
    }

    // activation code
    const activationCode = mathRandom(10000, 99999);
    // check activation code
    const checkCode = await User.findOne({ access_token: activationCode });
    if (checkCode) {
      activationCode = mathRandom(10000, 99999);
    }

    // New Otp send by mobile
    if (mobileData) {
      // send activation otp
      sendOtp(
        mobileCheck.mobile,
        `Hi ${mobileCheck.first_name} ${mobileCheck.sur_name}, Your account reset confirmation otp is ${activationCode}`
      );

      // Update new link
      await User.findByIdAndUpdate(mobileCheck._id, {
        access_token: activationCode,
      });

      res
        .status(200)
        .cookie("otp", mobileCheck.mobile, {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        })
        .json({
          message: "OTP code has been send on mobile",
          user: mobileCheck,
        });
    }

    // New Otp send by email

    if (emailCheck) {
      const activationToken = createToken({ id: emailCheck._id }, "30d");

      // Update new link
      await User.findByIdAndUpdate(emailCheck._id, {
        access_token: activationCode,
      });

      // send activation mail
      sendPasswordForgotLink(emailCheck.email, {
        name: emailCheck.first_name,
        link: `${
          process.env.APP_URL + ":" + process.env.PORT
        }/api/v1/user/activate/${activationToken}`,
        code: activationCode,
      });

      res
        .status(200)
        .cookie("otp", emailCheck.email, {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        })
        .json({
          message: "Activation link has been send",
        });
    }
  } catch (error) {
    next(error);
  }
}