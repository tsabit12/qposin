export const setOrder = (payload) => dispatch => dispatch({
	type: 'SET_ORDER',
	payload
})

export const resetOrder = () => dispatch => dispatch({
	type: 'RESET_ORDER'
})