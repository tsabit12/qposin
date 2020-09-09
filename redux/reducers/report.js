const initialState = {
	pickup: {},
	other: {},
}

export default function report(state=initialState, action) {
	switch(action.type){
		case 'FETCH_DETAIL_ORDER':
			return{
				...state,
				pickup: {
					...state.detailOrder.pickup,
					[action.date]: action.pickup
				},
				other: {
					...state.detailOrder.other,
					[action.date]: action.other
				}
			}
		default: 
			return state;
	}
}