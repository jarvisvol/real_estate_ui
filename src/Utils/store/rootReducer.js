import { combineReducers } from "redux";
import authReducer from "../../modules/auth/store/authReducer";
import adminReducer from "../../modules/adminpannel/store/adminReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
})

export default rootReducer;