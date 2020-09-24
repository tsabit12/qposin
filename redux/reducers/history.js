const intialState = {
	qob: []
}

export default function history(state=intialState, action={}) {
	switch(action.type){
		case 'GET_ORDER_QOB':
			return {
				...state,
				qob: action.orders
			}
		case 'GET_NEW_QOB':
			return {
				...state,
				qob: [...state.qob, ...action.orders ]
			}
		case 'PICKUP_ITEM':
			return {
				...state,
				qob: state.qob.map(row => {
					if(row.extid === action.extid) {
						return{ 
							...row,
							pickupnumber: action.noPickup
						}	
					}

					return row;
				})
			} 
		default:
			return state;
	}
}