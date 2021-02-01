import { ADD_MESSAGE, CLOSE_MESSAGE } from '../types';

export const addMessage = (msg, variant) => dispatch => dispatch({
    type: ADD_MESSAGE,
    msg,
    variant
})

export const closeMessage = () => dispatch => dispatch({
    type: CLOSE_MESSAGE
})