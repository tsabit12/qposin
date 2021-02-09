import { 
	GET_ORDER_QOB, 
	PICKUP_ITEM,
	RESET_HISTORY,
	SET_CHOOSED
} from '../types';

const intialState = {
	qob: []
}

export default function history(state=intialState, action={}) {
	switch(action.type){
		case GET_ORDER_QOB:
			return {
				...state,
				qob: [...state.qob, ...action.orders ]
			}
		case RESET_HISTORY:
			return {
				...state,
				qob: []
			}
		case PICKUP_ITEM:
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
		case SET_CHOOSED:
			return {
				...state,
				qob: state.qob.map(row => {
					if (row.extid === action.extid) {
						//check if already key choosed or not
						if (row.choosed) {
							return{
								...row,
								choosed: false
							}
						}else{
							return{
								...row,
								choosed: true
							}
						}
					}

					return row;
				})
			} 
		case 'REMOVE_ALL_CHOOSED':
			return {
				...state,
				qob: state.qob.map(row => {
					delete row.choosed;
					return row;
				})
			}
		case 'MULTIPLE_ORDER_WAS_PICKUP':
			return {
				...state,
				qob: state.qob.map(row => {
					if (action.groupExtid.includes(row.extid)) {
						return {
							...row,
							choosed: false,
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