const initialState = {
	logged: false,
	localUser: {}
}

export default function auth(state=initialState, action={}){
	switch(action.type){
		case 'SET_LOCAL_USER':
			return{
				...state,
				localUser: action.user
			}
		default: 
			return state;
	}
}