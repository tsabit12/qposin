import axios from 'axios';
import hashing from './utils/hashing';
const url 	= 'https://qcomm.posindonesia.co.id:10444/a767e8eec95442bda80c4e35e0660dbb'; //live
const url1 	= 'https://order.posindonesia.co.id/api';


const config = {
	headers: {
		'Content-Type': 'Application/json'	
	}
}

const configYuyus = {	
	headers: { 
  		'content-type': 'application/x-www-form-urlencoded',
  		'accept': 'application/json'
  	},
  	auth: {
		username: 'ecom',
		password: '05144f4e12aaa402aeb51ef2c7dde527'
	}
} 


export default {
	lacakKiriman: (barcode) => axios.post(`${url1}/lacak`, {
		barcode
	}).then(res => res.data.result),
	sendWhatsApp: (payload) => axios.post('https://profilagen.posindonesia.co.id/chatbot/KirimWhatsapp', {
		...payload
	}, config).then(res => res.data),
	bantuan: (param1, userid) => axios.post(url, {
		messtype: '220',
		param1,
		hashing: hashing('220', param1)
	}, configYuyus).then(res => {
		console.log(res);
		if (res.data.rc_mess === '00' || res.data.rc_mess === '02' || res.data.rc_mess === '01') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	verifikasiBantuan: (param1, userid) => axios.post(url, {
		messtype: '221',
		param1: param1,
		hashing: hashing('221', param1)
	}, configYuyus).then(res => {
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	login: (payload, userid) => axios.post(url, {
		messtype: '216',
		param1: payload,
		hashing: hashing('216', payload)
	}, configYuyus)
		.then(res => res.data)
		.catch(err => {
			if (err.response) {
				const errors = {
					global: 'Terdapat kesalahan, mohon coba beberapa saat lagi',
					status: err.response.status
				}
				return Promise.reject(errors);
			}else{
				const errors = {
					global: 'Network error',
					status: 500
				}
				return Promise.reject(errors);
			}
		}),
	getKota: () => axios.get('https://order.posindonesia.co.id/api/refkota.json').then(res => res.data),
	getKecamatan: (kota) => axios.post(`${url1}/qposinaja/getPostalCode`, {
		kota
	}).then(res => res.data.result),
	getTarif: (param1) => axios.post(url, {
		messtype: '703',
		param1,
		param2: '',
		param3: '',
		param4: '',
		param5: '',
		hashing: hashing('703', param1)
	}, configYuyus)
	.then(res => {
		const { rc_mess } = res.data;
		if (rc_mess === '00') {
			return res.data.response_data1.substring(2);
		}else{
			const errors = {
				global: 'Tarif tidak ditemukan'
			};
			return Promise.reject(errors);
		}
	}),
	pushToken: (payload) => axios.post(`https://order.posindonesia.co.id/api/Qposinaja/pushToken`, {
		...payload
	}).then(res => res.data)
}