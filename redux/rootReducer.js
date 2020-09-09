import { combineReducers } from "redux";
import order from "./reducers/order";
import auth from "./reducers/auth";
import report from "./reducers/report";
//import notification from './reducers/notification';

export default combineReducers({
	order,
	auth,
	report
	//notification
});