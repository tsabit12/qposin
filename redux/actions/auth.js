export const setLocalUser = user => dispatch => dispatch({
	type: 'SET_LOCAL_USER',
	user
})

export const setLoggedIn = (session) => dispatch => dispatch({
	type: 'USER_LOGGED_IN',
	session
})

export const updatePin = (localUser) => dispatch => dispatch({
	type: 'UPDATE_PIN',
	localUser
})