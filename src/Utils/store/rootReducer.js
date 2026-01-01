import { combineReducers } from "redux";
import authReducer from "../../modules/auth/store/authReducer";
import adminReducer from "../../modules/adminpannel/store/adminReducer";
import propertyReducer from "../../modules/Properties/store/propertyReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    property: propertyReducer,
})

export default rootReducer;