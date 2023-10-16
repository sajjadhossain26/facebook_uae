
// Hide email or mobile
export const emailHide = (data) => {
 
    let com = data.split("@")[1];
    let mail = data.split("@")[0];
  console.log('com', com);
  console.log('mail', mail);
    const first = mail.substr(0, 1);
    const last = mail.substr(-1, 1);
    return `${first}*****************${last}@${com}`;
};

export const mobileHide = (data) => {
    
        const first = data.substr(0, 3);
        const last = data.substr(-2);
        return `${first}******${last}`;
   
}