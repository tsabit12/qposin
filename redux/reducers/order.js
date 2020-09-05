const initialState = {
	kodeposA: '',
	kecamatanA: '',
	kotaA: '',
	kodeposB: '',
	kecamatanB: '',
	kotaB: '',
	isikiriman: '',
	berat: '',
	panjang: '',
	lebar: '',
	tinggi: ''
}

export default function order(state=initialState, action={}){
	switch(action.type){
		case 'SET_ORDER':
			return{
				...state,
				...action.payload
			}
		default: 
			return state;
	}
}