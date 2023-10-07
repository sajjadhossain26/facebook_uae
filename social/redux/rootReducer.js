
import { combineReducers } from "redux";
import AuthReducer from "./auth/authReducer";

// crate root reducer 

const rootReducer = combineReducers({
    auth: AuthReducer,
});

export default rootReducer;