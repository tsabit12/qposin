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
	})
}