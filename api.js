import axios from 'axios';
import hashing from './utils/hashing';

const urlCityCourier = 'https://qcomm.posindonesia.co.id:10444/a767e8eec95442bda80c4e35e0660dbb';

const getOrderUrl = 'https://qcomm.posindonesia.co.id:10444/getOrder';
const url 	= 'https://qcomm.posindonesia.co.id:10444/a767e8eec95442bda80c4e35e0660dbb'; //live
// const url 	= 'https://qcomm.posindonesia.co.id:10555/a767e8eec95442bda80c4e35e0660dbb'; //dev
const url1 	= 'https://order.posindonesia.co.id/api';

let configFast = {
	headers: { 
  		'content-type': 'application/json',
  		'accept': 'application/json'
  	}
}


const getLastStringAfterSpace = (words) => {
    var n = words.split(" ");
    return n[n.length - 1];

}

// const GOOGLE_API_KEY = 'AIzaSyA8xP2eX_my7NBK-ysRHyg4QP-znaTxAsg';
const GOOGLE_API_KEY = 'AIzaSyCfveavBzHw8zjByDPonahtt2VzpwUAIBA';


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
	sendWhatsApp: (payload, urlWa) => axios.post(urlWa, {
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
	}).then(res => res.data),
	updatePin: (param1) => axios.post(url, {
		messtype: '208',
		param1,
		hashing: hashing('208', param1)
	}, configYuyus).then(res => {
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			return Promise.reject(res.data);
		}
	}),
	getLinkWa: (payload) => axios.post(`${url1}/qposinaja/whatsapp`, {
		...payload
	}).then(res => res.data),
	registrasi: (payload) => axios.post(url, {
		messtype: '215',
		...payload,
		hashing: hashing('215', payload.param1)
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
	getRoute: (sender, receiver) => 
		axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=eF6ofksmF3MMfyeHi96K0Qf8P6DMZyZhEEnsxBLmTYo&waypoint0=geo!${sender.latitude},${sender.longitude}&waypoint1=geo!${receiver.latitude},${receiver.longitude}&mode=fastest;car;traffic:disabled&legAttributes=shape`)
			.then(res => res.data.response.route[0]),
	google: {
		getAddres: (payload) => axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
			params: {
				latlng: `${payload.latitude},${payload.longitude}`,
				key: GOOGLE_API_KEY
			}
		}).then(res => {
			if (res.data.results.length > 0) {
				const { results } = res.data;
				const addressArr = results[0].formatted_address.split(',');
				// console.log(results);
				var response = {};
				
				if (addressArr.length === 6) {
					const kodepos = getLastStringAfterSpace(addressArr[4]);
					response = {
						street: addressArr[0].trim(),
						kelurahan: addressArr[1].trim(),
						kecamatan: addressArr[2].trim(),
						kota: addressArr[3].trim(),
						kodepos: kodepos,
					}	
				}else if(addressArr.length === 7){
					const kodepos = getLastStringAfterSpace(addressArr[5]);
					response = {
						street: addressArr[1].trim(),
						kelurahan: addressArr[2].trim(),
						kecamatan: addressArr[3].trim(),
						kota: addressArr[4].trim(),
						kodepos: kodepos
					}	
				}else{
					const kodepos = getLastStringAfterSpace(addressArr[6]);
					response = {
						street: `${addressArr[0].trim()} ${addressArr[1].trim()}`,
						kelurahan: addressArr[3].trim(),
						kecamatan: addressArr[4].trim(),
						kota: addressArr[5].trim(),
						kodepos: kodepos,
					}	
				}

				return Promise.resolve(response);
			}else{
				console.log(res.data);
				const errors = {
					global: 'Address not found'
				}
				return Promise.reject(errors);
			}
		}),
		findLatlongbyAddres: (value) => axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
			params: {
				query: value,
				// components: 'country:indonesia',
				key: GOOGLE_API_KEY
			}
		}).then(res => {
			const { results } = res.data;
			if (results.length > 0) {
				const response = [];
				results.forEach(places => {
					response.push({
						label: places.formatted_address,
						location: places.geometry.location
					})
				})

				return Promise.resolve(response);
			}else{
				return Promise.reject(res);
			}
		})
	},
	cityCourier: {
		getTarif: (payload) => axios.post(urlCityCourier, {
			messtype: '401',
			...payload,
			hashing: hashing('401', payload.param1)
		}, configYuyus)
			.then(res => res.data),
		order: (payload) => axios.post(urlCityCourier, {
			messtype: '402',
			...payload,
			hashing: hashing('402', payload.param1)
		}, configYuyus).then(res => res.data),
		getOrder: (userid) => axios.post(getOrderUrl, {
			userid: userid
		}, configYuyus).then(res => res.data),
		pembayaran: (userid, param2) => axios.post(urlCityCourier, {
			messtype: '403',
			param1: userid,
			param2,
			hashing: hashing('403', userid)
		}, configYuyus)
			.then(res => {
				const { rc_mess, desk_mess } = res.data;
				if (rc_mess === '00') {
					return Promise.resolve(res.data);
				}else{
					const errors = {
						code: rc_mess,
						msg: desk_mess
					};
					return Promise.reject(errors);
				}
			}),
		cancle: (payload) => axios.post(urlCityCourier, {
			messtype: '405',
			param1: payload.userid,
			param2: payload,
			userid: payload.userid,
			hashing: hashing('405', payload.userid)
		}, configYuyus).then(res => {
			if (res.data.rc_mess === '00') {
				return Promise.resolve(res.data);
			}else{
				const errors = {
					msg: res.data.desk_mess,
					status: res.data.rc_mess
				};

				return Promise.reject(errors);
			}
		}),
		mapping: (kota) => axios.post(`${url1}/Qposinaja/kotaQcc`, {
			kota
		}).then(res => res.data.result)
	},
	getNotification: (payload) => axios.post(`${url1}/Qposinaja/logNotif`, {
		...payload
	}).then(res => res.data.result),
	qob: {
		booking: (payload) => axios.post(`${url1}/Qposinaja/addorder`, {
			...payload
		}, config).then(res => {
			if (res.data.respcode === '000') {
				return res.data;
			}else{
				return Promise.reject(res.data);
			}
		}),
		syncronizeUser: (payload) => axios.post(`${url1}/Qposinaja/sync`, {
			...payload
		}).then(res => {
			const { result } = res.data;
			if (result.respcode === '00') {
				return result;
			}else{
				return Promise.reject(result);
			}
		}),
	},
	generatePwdWeb: (userid) => axios.post(url,{
		messtype: '213',
		param1: userid,
		hashing: hashing('213', userid)
	},configYuyus).then(res => {
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			return Promise.reject(res.data);
		}
	}),
	generateToken: (userid) => axios.post(url, {
		userid,
		messtype: '213',
		param1: userid,
		hashing: hashing('213', userid)
	}, configYuyus).then(res => {
		if (res.data.rc_mess === '00') {
			return Promise.resolve(res.data);
		}else{
			const errors = {
				global: res.data.desk_mess
			}
			return Promise.reject(errors);
		}
	}),
	syncronizeUserPwd: (payload) => axios.post(`${url1}/Qposinaja/sync`, {
		...payload
	}).then(res => {
		const { result } = res.data;
		if (result.respcode === '00' || result.respcode === '21') {
			return result;
		}else{
			return Promise.reject(result);
		}
	}),
	connectToGiro: (rek, userid) => axios.post(url, {
		messtype: '217',
		param1: rek,
		param2: userid,
		hashing: hashing('217', rek)
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
	validateGiro: (param1) => axios.post(url, {
		messtype: '218',
		param1,
		hashing: hashing('218', param1)
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
	updateProfil: (param1, userid) => axios.post(url, {
		userid,
		messtype: '224',
		param1,
		hashing: hashing('224', param1)
	}, configYuyus).then(res => {
		console.log(res);
		if (res.data.rc_mess === '00') {
			return res.data;
		}else{
			const errors = {
				global: res.data.desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	getDetailOrder: (payload) => axios.post(`${url1}/history/getOrder`, {
		...payload
	}).then(res => {
		const { status, result } = res.data;
		if (status === 200) {
			if (result.length > 0) {
				return Promise.resolve(result);
			}else{
				const errors = {
					msg: 'Data kiriman kamu kosong, silahkan melakukan order terlebih dahulu'
				}
				return Promise.reject(errors);
			}
		}else{
			const errors = {
				msg: 'Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi'
			}
			return Promise.reject(errors);
		}
	}),
	// addPickup: (payload) => axios.post('https://fasterv2.fastkurir.com/api/customer/bidding_v2', {
	// 	...payload
	// }, configFast).then(res => {
	// 	if (res.data.status === true) {
	// 		return res.data;
	// 	}else{
	// 		const errors = {
	// 			msg: 'Duplicate extid'
	// 		}
	// 		return Promise.reject(errors);
	// 	}
	// }),
	addPickup: (payload) => axios.post('https://meterai.posindonesia.co.id/dev/bidding/Api/bidding_process', {
		...payload
	}, configFast).then(res => {
		console.log(res.data);
		console.log(payload);
		if (res.data.code === '00') {
			return {
				pickup_number: res.data.pickup_number,
				...res.data.result
			}
		}else{
			const errors = {
				msg: `${res.data.message}`
			}
			return Promise.reject(errors);
		}
	}),
	getHistoryStatus: (payload) => axios.post(`${url1}/Qposinaja/history`, {
		...payload
	}).then(res => {
		const { result } = res.data;
		if (!result.data) {
			return Promise.reject(result);
		}else{
			return result;
		}
	}),
	searchRekeningType: (rekening) => axios.post(url, {
		messtype: '226',
		param1: rekening,
		hashing: hashing('226', rekening)
	}, configYuyus).then(res => {
		if (res.data.rc_mess === '99') {
			const { response_data2 } = res.data;
			const value = response_data2.split("|");
			if (value[5] === 'GIROPOS REGULER') {
				// if (parseInt(value[2]) < 10000) {
				// 	const errors = {
				// 		global: 'Fitur COD dinonaktifkan. Saldo rekening minimal adalah 10.000 ribu, silahkan lakukan top up terlebih dahulu'
				// 	};
				// 	return Promise.reject(errors);
				// }else{
				// 	return Promise.resolve(res.data);
				// }
				return Promise.resolve(value);
			}else{//invalid rekening type
				const errors = {
					global: 'Fitur COD dinonaktifkan. Harap hubungi CS untuk mengubah tipe rekening menjadi reguler'
				};
				return Promise.reject(errors);
			}
		}else{
			const { desk_mess } = res.data;
			const errors = {
				global: desk_mess
			};
			return Promise.reject(errors);
		}
	}),
	syncronizeCod: (payload) => axios.post(`${url1}/Qposinaja/syncGiro`, {
		...payload
	}).then(res => {
		const { result } = res.data;
		if (result.respcode === '00' || result.respcode === '21') {
			return result;
		}else{
			return Promise.reject(result);
		}
	}),
	testApi: () => axios.post(`${url1}/test`).then(res => res.data),
	updateStatusPickup: (payload) => axios.post(`${url1}/qposinaja/confirmPickup`, {
		...payload
	}).then(res => {
		if (!res.data) {
			return Promise.reject(res);
		}else{
			return res.data;
		}
	}),
}