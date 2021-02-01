import { ADD_MESSAGE, CLOSE_MESSAGE } from '../types';
const initialState = {
    msg: 'Notification...',
    open: false,
    variant: 'success'
}

export default function message(state=initialState, action={}){
    switch(action.type){
        case ADD_MESSAGE:
            return {
                ...state,
                open: true,
                msg: action.msg,
                variant: action.variant
            }
        case CLOSE_MESSAGE:
            return {
                ...state,
                open: false
            }
        default:
            return state;
    }
}