import { combineReducers } from "redux";
import authReducer from "../../modules/auth/store/authReducer";

const rootReducer = combineReducers({
    auth: authReducer,
})

export default rootReducer;