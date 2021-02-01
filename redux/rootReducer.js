import { combineReducers } from "redux";
import order from "./reducers/order";
import auth from "./reducers/auth";
import report from "./reducers/report";
import history from './reducers/history';
//import notification from './reducers/notification';
import message from './reducers/message';
import schedule from './reducers/schedule';

export default combineReducers({
	order,
	auth,
	report,
	history,
	message,
	schedule
	//notification
});