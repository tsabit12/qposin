import axios from 'axios';

const url1 = 'https://order.posindonesia.co.id/api';

export default {
	lacakKiriman: (barcode) => axios.post(`${url1}/lacak`, {
		barcode
	}).then(res => res.data.result)
}