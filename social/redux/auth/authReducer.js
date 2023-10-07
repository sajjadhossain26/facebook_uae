
import initialState from "./initialState";

/**
 * Create auth reducer
 */


const AuthReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case '':
            break;
        
        default: 
           return state;
    }
}

export default AuthReducer;