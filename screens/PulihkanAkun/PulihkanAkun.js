import React, { useState, useRef, useEffect } from 'react';
import { 
	View, 
	Text, 
	ImageBackground, 
	StyleSheet, 
	TouchableOpacity,
	TextInput,
	StatusBar,
	AsyncStorage
} from 'react-native';
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon, Toast } from 'native-base';
import rgba from 'hex-to-rgba';
import AnimatedLoader from "react-native-animated-loader";
import {
	VerificationView,
	ChangePinView
} from './components';
import api from '../../api';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { setLocalUser } from '../../redux/actions/auth';

const getCurdate = () => {
	var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   

    var dateTime = year+''+month+''+day; //+' '+hour+':'+minute+':'+second;   
    return dateTime;
}

const PulihkanAkun = props => {
	const phoneRef = useRef();
	const emailRef = useRef();

	const [state, setState] = useState({
		data: {
			phone: '',
			email: '',
			userid: ''
		},
		errors: {},
		loading: false,
		showVerifyCode: false,
		verifyCode: null,
		// isChangePin: {
		// 	open: false,
		// 	newPin: ''
		// },
		type: '2'
	})

	// const { isChangePin } = state;

	useEffect(() => {
		(async () => {
			const value = await AsyncStorage.removeItem("HISTORI_REQUST_PEMULIHAN");
			if (value !== null) {
				const toObj = JSON.parse(value);
				if (toObj.curdate === getCurdate()) { //1 request expired in 1 day, so remove if date in storage is not now
					setState(state => ({
						...state,
						data: {
							phone: toObj.phone,
							email: toObj.email,
							userid: toObj.userid
						},
						verifyCode: toObj.verifyCode,
						showVerifyCode: true
					}))
				}
			}
		})();
	}, []);


	useEffect(() => {
		if (props.route.params) {
			setState(state => ({
				...state,
				type: '1'
			}))
		}
	}, [props.route])

	const { data, errors, loading, showVerifyCode } = state;

	const handleChange = (name, value) => setState(state => ({
		...state,
		data: {
			...state.data,
			[name]: value
		},
		errors: {
			...state.errors,
			[name]: undefined
		}
	}))

	const onSubmit = () => {
		const errors = validate(data);
		setState(state => ({
			...state,
			errors
		}))

		if (Object.keys(errors).length === 0) {
			setState(state => ({
				...state,
				loading: true
			}))

			// const param1 = `${data.userid}|-|${data.phone}|${data.email}|${Constants.deviceId}|${state.type}`;
			const param1 = `-|-|${data.phone}|${data.email}|${Constants.deviceId}|2`;
			
			api.bantuan(param1)
				.then(res => {
					//handle if verify code is empty 
					console.log(res);
					const { response_data2, response_data5 } = res;

					const payload = {
						...state.data,
						userid: response_data5,
						curdate: getCurdate(),
						verifyCode: response_data2
					};

					const savedCodeVerify = saveRequestValueToStorage(payload);
					
					if (savedCodeVerify) {
						setState(state => ({
							...state,
							data: {
								...state.data,
								userid: response_data5
							},
							loading: false,
							verifyCode: response_data2,
							showVerifyCode: true
						}))
					}else{
						setState(state => ({
							...state,
							loading: false
						}))

						Toast.show({
			                text: 'Request gagal 400',
			                textStyle: { textAlign: 'center' },
			                duration: 4000
			            })
					}
				})
				.catch(err => {
					setState(state => ({
						...state,
						loading: false
					}))

					if (err.global) {
						Toast.show({
			                text: err.global,
			                textStyle: { textAlign: 'center' },
			                duration: 4000
			            })
					}else{
						Toast.show({
			                text: 'Tidak dapat memproses permintaan anda, silahkan coba beberapa saat lagi',
			                textStyle: { textAlign: 'center' },
			                duration: 4000
			            })
					}
				});
		}
	}

	const handleConfirmCode = (code) => {
		setState(state => ({
			...state,
			showVerifyCode: false,
			loading: true
		}))
		const param1 = `${data.userid}|-|${data.phone}|${data.email}|${Constants.deviceId}|${code}|2`;
		
		api.verifikasiBantuan(param1)
			.then(res => {
				const { response_data2, response_data1 } = res;
				const parsing 	 = response_data2.split('|');

				const payloadQobUser = {
					username: parsing[1],
					pinMd5: parsing[2],
					nama: parsing[3],
					nohp: parsing[4],
					email: parsing[5],
					userid: data.userid
				};

				const savePayloadQobUser = saveQobUser(payloadQobUser);

				if (savePayloadQobUser) {
					AsyncStorage.removeItem('HISTORI_REQUST_PEMULIHAN');
					props.setLocalUser(savePayloadQobUser);
					
					setState(state => ({
						...state,
						loading: false,
						data: {
							phone: '',
							email: ''
						}
					}));

					setTimeout(() => {
						props.navigation.push('CreatePin', {
							recovery: true
						});
					}, 1000);
					
				}else{
					setState(state => ({
						...state,
						loading: false,
						showVerifyCode: true
					}));

					Toast.show({
		                text: 'Request gagal 400',
		                textStyle: { textAlign: 'center' },
		                duration: 4000
		            })
				}
			})
			.catch(err => {
				setState(state => ({
					...state,
					loading: false,
					showVerifyCode: true
				}));
				if (err.global) {
					Toast.show({
		                text: err.global,
		                textStyle: { textAlign: 'center' },
		                duration: 4000,
		                position:'top'
		            })
				}else{
					Toast.show({
		                text: 'Tidak dapat memproses permintaan anda, silahkan coba beberapa saat lagi',
		                textStyle: { textAlign: 'center' },
		                duration: 4000,
		                position:'top'
		            })
				}
			})
	}

	const validate = (field) => {
		const errors 	= {};
		var phoneRegex 	= /^(^\62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/;
		var emailRegex 	= /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line

		if (!field.phone) errors.phone = 'Nomor ponsel belum diisi';
		if (!phoneRegex.test(field.phone) && field.phone) errors.phone = 'Nomor telphone tidak valid';
		if (!field.email) errors.email = 'Alamat email belum diisi';
		if (!emailRegex.test(field.email) && field.email) errors.email = 'Alamat email tidak valid';

		return errors;
	}

	const saveRequestValueToStorage = async (payload) => {
		try {
			await AsyncStorage.setItem('HISTORI_REQUST_PEMULIHAN', JSON.stringify(payload));
			return true;
		}catch(err){
			return false
		}
	}

	const saveQobUser = async (payload) => {
		try{
			await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(payload));
			return true;
		}catch(err){
			return false;
		}
	}

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={styles.root}
		>		
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    { state.loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }
		    { state.showVerifyCode && 
		    	<VerificationView 
		    		onVerifyCode={handleConfirmCode}
		    		phone={data.phone}
		    		verifyCode={state.verifyCode}
		    	/> }
		    
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					{state.type === '2' ? 'Pemulihan akun' : 'Lupa PIN'}
				</Text>
			</View>
			<View style={styles.container}>
				<View style={styles.field}>
					<Text style={[styles.text, {marginLeft: 5}]}>Nomor Ponsel</Text>
					<TextInput 
						ref={phoneRef}
						style={styles.input}
						placeholder='Masukkan nomor ponsel'
						value={data.phone}
						onChangeText={(value) => handleChange('phone', value)}
						keyboardType='phone-pad'
						returnKeyType='next'
						onSubmitEditing={() => emailRef.current.focus()}
					/>
					{ errors.phone && <Text style={styles.textError}>{errors.phone}</Text>}
				</View>

				<View style={styles.field}>
					<Text style={[styles.text, {marginLeft: 5}]}>Email</Text>
					<TextInput 
						style={styles.input}
						ref={emailRef}
						placeholder='Masukkan email'
						value={data.email}
						onChangeText={(value) => handleChange('email', value)}
						keyboardType='email-address'
						autoCapitalize='none'
						returnKeyType='done'
					/>
					{ errors.email && <Text style={styles.textError}>{errors.email}</Text>}
				</View>

				<TouchableOpacity
					style={{
						borderWidth: 1,
						borderColor: '#FFF',
						height: hp('6%'),
						borderRadius: 30,
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 20
					}}
					activeOpacity={0.6}
					onPress={onSubmit}
				>
					<Text style={styles.text}>
						{ state.type === '2' ? 'Pulihkan' : 'Submit' }
					</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		// backgroundColor: 'white',
		alignItems: 'center',
		marginLeft: 20
	},
	container: {
		padding: 10,
		marginTop: 10,
		justifyContent: 'center',
		//backgroundColor: 'green',
		height: hp('45%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	btn: {
		width: wp('7%'),
	},
	input: {
		backgroundColor: 'white',
		height: hp('6%'),
		borderRadius: 30,
		paddingLeft: 15
	},
	field: {
		height: hp('12%'),
		// backgroundColor: 'green',
		justifyContent: 'space-around'
	},
	textError: {
		textAlign: 'center',
		marginTop: 2,
		color: rgba('#FFF', 0.7)
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

PulihkanAkun.propTypes = {
	setLocalUser: PropTypes.func.isRequired
}

export default connect(null, { setLocalUser })(PulihkanAkun);