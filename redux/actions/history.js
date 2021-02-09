import api from '../../api';
import { GET_ORDER_QOB } from '../types';

export const getQob = (payload) => dispatch => 
	api.getDetailOrder(payload)
		.then(result => dispatch({
				type: GET_ORDER_QOB,
				orders: result
			})
		)

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