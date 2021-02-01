import { GET_SCHEDULE } from "../types";

export default function schedule(state=[], action){
    switch(action.type){
        case GET_SCHEDULE:
            return action.schedules
        default:
            return state;
    }
}