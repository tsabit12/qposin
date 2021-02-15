import api from '../../api';
import { 
	GET_ORDER_QOB, 
	REMOVE_ALL_CHOOSED, 
	REMOVE_ORDER, 
	SET_CHOOSED,
	UPDATE_NOPICKUP
} from '../types';

export const getQob = (payload) => dispatch => 
	api.getDetailOrder(payload)
		.then(result => dispatch({
				type: GET_ORDER_QOB,
				orders: result
			})
		)

export const resetHistory = () =>  dispatch =>
	dispatch({
		type: 'RESET_HISTORY'
	})

export const setChoosed = (extid) => dispatch => dispatch({
	type: SET_CHOOSED,
	extid
})

export const removeAllChoosed = () => dispatch => dispatch({
	type: REMOVE_ALL_CHOOSED
})

export const updateNomorPickup = (noPickup, groupExtid) => dispatch => dispatch({
	type: UPDATE_NOPICKUP,
	noPickup,
	groupExtid
})

export const removeItem = (extid, status) => dispatch =>
	dispatch({
		type: REMOVE_ORDER,
		extid,
		status
	}) 