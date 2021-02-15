import { 
	GET_ORDER_QOB,
	REMOVE_ORDER,
	RESET_HISTORY,
	SET_CHOOSED,
	UPDATE_NOPICKUP,
	REMOVE_ALL_CHOOSED
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
		case REMOVE_ALL_CHOOSED:
			return {
				...state,
				qob: state.qob.map(row => {
					delete row.choosed;
					return row;
				})
			}
		case UPDATE_NOPICKUP:
			return {
				...state,
				qob: state.qob.map(row => {
					if (action.groupExtid.includes(row.extid)) {
						return {
							...row,
							choosed: false,
							pickupnumber: action.noPickup,
							lasthistorystatus: 'Pickup'
						}
					}

					return row;
				})
			}
		case REMOVE_ORDER:
			return {
				...state,
				qob: action.status === '20' ? state.qob.map(row => {
					if(row.extid === action.extid){
						return {
							...row,
							pickupnumber: null,
							lasthistorystatus: 'Batal Pickup',
							laststatusid: 1
						}
					}

					return row;
				}) : state.qob.filter(row => row.extid !== action.extid)
			}
		default:
			return state;
	}
}