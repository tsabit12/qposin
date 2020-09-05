const initialState = {
	logged: true,
	localUser: {
		"email": "tsabit830@gmail.com",
		"nama": "-",
		"nohp": "087736967892",
		"pinMd5": "d8b748b967469a7fb681b6462cd8934d",
		"userid": "440000065",
		"username": "-"
	},
	session: {
		nama: 'Tsabit'
	}
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
		default: 
			return state;
	}
}