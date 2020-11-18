import api from '../../api';

export const getQob = (payload) => dispatch => 
	api.getDetailOrder(payload)
		.then(result => {
			dispatch({
				type: payload.offset === 0 ? 'GET_ORDER_QOB' : 'GET_NEW_QOB',
				orders: result
			})
		})

export const onPickuped = (noPickup, extid) => dispatch => dispatch({
	type: 'PICKUP_ITEM',
	noPickup,
	extid
})

export const setChoosed = (extid) => dispatch => dispatch({
	type: 'SET_CHOOSED',
	extid
})

export const removeAllChoosed = () => dispatch => dispatch({
	type: 'REMOVE_ALL_CHOOSED'
})

export const mutltipletPickuped = (noPickup, groupExtid) => dispatch => dispatch({
	type: 'MULTIPLE_ORDER_WAS_PICKUP',
	noPickup,
	groupExtid
})