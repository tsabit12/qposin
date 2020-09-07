const initialState = {
	logged: false,
	localUser: {},
	session: {}
}

export default function auth(state=initialState, action={}){
	switch(action.type){
		case 'SET_LOCAL_USER':
			return{
				...state,
				localUser: action.user
			}
		case 'USER_LOGGED_IN':
			return{
				...state,
				session: action.session,
				logged: true
			}
		case 'UPDATE_PIN':
			return{
				...state,
				localUser: action.localUser
			}
		case 'CALCULATE_SALDO':
			return {
				...state,
				session: {
					...state.session,
					saldo: action.calculateType === 'min' ? 
						Number(state.session.saldo) - Number(action.nominal) : 
						Number(state.session.saldo) + Number(action.nominal)
				}
			}
		default: 
			return state;
	}
}