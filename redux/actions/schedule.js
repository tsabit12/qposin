import api from "../../api";
import { GET_SCHEDULE } from "../types";

export const getSchedule = (payload) => dispatch => 
    api.qob.getschedulepickup(payload)
        .then(schedules => {
            dispatch({
                type: GET_SCHEDULE,
                schedules
            })
        })