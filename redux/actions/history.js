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