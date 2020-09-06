const initialState = {
	kodeposA: '',
	kecamatanA: '',
	kotaA: '',
	kodeposB: '',
	kecamatanB: '',
	kotaB: ''
}

export default function order(state=initialState, action={}){
	switch(action.type){
		case 'SET_ORDER':
			return{
				...state,
				...action.payload
			}
		case 'RESET_ORDER':
			return{
				kodeposA: '',
				kecamatanA: '',
				kotaA: '',
				kodeposB: '',
				kecamatanB: '',
				kotaB: ''	
			}
		default: 
			return state;
	}
}