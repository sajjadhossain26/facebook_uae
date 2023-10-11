

// Email validation

export const isEmail= (email) => {
    return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
}

// Mobile validation
export const isMobile= (mobile) => {
    return /^(01|8801|\+8801)[0-9]{9}$/.test(mobile);
}


export const isString = (data) => {
    return /^[a-z@\.]{1,}$/.test(data);
}

export const isNumber = (number) => {
    return /^[0-9\+]{1,}$/.test(number)
}