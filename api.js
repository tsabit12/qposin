import axios from 'axios';

const url1 = 'https://order.posindonesia.co.id/api';
const config = {
	headers: {
		'Content-Type': 'Application/json'	
	}
}

export default {
	lacakKiriman: (barcode) => axios.post(`${url1}/lacak`, {
		barcode
	}).then(res => res.data.result),
	sendWhatsApp: (payload) => axios.post('https://profilagen.posindonesia.co.id/chatbot/KirimWhatsapp', {
		...payload
	}, config).then(res => res.data)
}