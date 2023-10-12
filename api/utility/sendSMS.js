// register confirmation otp

export const sendOtp = async (cell, sms) => {
    try {
        await axios.get(` http://bulksmsbd.net/api/smsapi?api_key=${process.env.SMS_API_KEY}&type=${process.env.SMS_TYPE}&number=${cell}&senderid=${process.env.SMS_SERNDER_ID}Random&message=${sms}`)
    } catch (error) {
       console.log(error);
    }
}