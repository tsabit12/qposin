import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	ImageBackground,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity,
	Animated,
	AsyncStorage,
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Constants from 'expo-constants';
import { Toast } from 'native-base';
import AnimatedLoader from "react-native-animated-loader";
import api from '../../api';
import { connect } from 'react-redux';
import { setLocalUser } from '../../redux/actions/auth';

const CompleteRegistrasi = props => {
	const { params } = props.route;

	const [state, setState] = useState({
		data: {
			phone: '',
			nama: '',
			email: '',
			namaUsaha: '',
			jenisUsaha: '',
			type: ''
		},
		bouncValue: new Animated.Value(-100),
		activePage: 1,
		loading: false
	})

	const { data, bouncValue, activePage } = state;

	useEffect(() => {
		Animated.spring(bouncValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      duration: 500,
	      friction: 8
	    }).start();
	}, [state.activePage]);

	useEffect(() => {
		if (params.phone) {
			setState(state => ({
				...state,
				data: {
					...state.data,
					phone: params.phone
				}
			}))
		}
	}, [params])

	const handleChange = (text, name) => setState({
		...state,
		data: {
			...state.data,
			[name]: text
		}
	})

	const handleSubmit = (active) => {
		if (!data.nama) {
			Toast.show({
                text: 'Nama belum diisi',
                textStyle: { textAlign: 'center' },
                duration: 3000
            })
		}else if(!data.email){
			Toast.show({
                text: 'Email Belum diisi',
                textStyle: { textAlign: 'center' },
                duration: 3000
            })
		}else{
			bouncValue.setValue(-100);
			setState(state => ({
				...state,
				activePage: active
			}))
		}

	}

	const onPressPebisol = (type) => {
		if (type === 1) {
			bouncValue.setValue(-100);
		}else{
			handleRegistrasi();
		}

		setState(state => ({
			...state,
			data: {
				...state.data,
				type
			},
			activePage: type === 1 ? 3 : 2
		}))
	}

	//i meant olny pebisol
	const handleRegistrasi = () => {
		const payload = {};
		if (data.type === 1) { //pebisol
			if (!data.namaUsaha) {
				Toast.show({
	                text: 'Nama usaha belum diisi',
	                textStyle: { textAlign: 'center' },
	                duration: 3000
	            })
			}else if(!data.jenisUsaha){
				Toast.show({
	                text: 'Jenis usaha belum diisi',
	                textStyle: { textAlign: 'center' },
	                duration: 3000
	            })
			}else{
				payload.param1 = `00|${data.nama}|${data.phone}|${data.email}|${Constants.deviceId}`;
				payload.param2 = `-|-|-|-|-|-`;
				payload.param3 = `${data.namaUsaha}|${data.jenisUsaha}|-|-|-|-|-|-`;
			}
		}else{
			payload.param1 = `00|${data.nama}|${data.phone}|${data.email}|${Constants.deviceId}`;
			payload.param2 = `-|-|-|-|-|-`;
			payload.param3 = `-|-|-|-|-|-`; 
		}

		if (Object.keys(payload).length > 0) {
			setState(state => ({
				...state,
				loading: true
			}))

			api.registrasi(payload)
				.then(res => {
					const { response_data1 } = res;
					const x = response_data1.split('|');
					const toSave = {
						userid: x[0],
						username: x[1],
						pinMd5: x[2],
						nama: x[3],
						nohp: x[4],
						email: x[5],
						shouldChangepin: true
					};

					props.setLocalUser(toSave);

					setState(state => ({
						...state,
						loading: false
					}))

					const savePayloadQobUser = saveQobUser(toSave);
					if (savePayloadQobUser) {
						props.navigation.navigate('CreatePin');
					}else{
						Toast.show({
			                text: 'Unknown error',
			                textStyle: { textAlign: 'center' },
			                duration: 3000
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
			                duration: 3000
			            })
					}else{
						Toast.show({
			                text: 'Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi',
			                textStyle: { textAlign: 'center' },
			                duration: 3000
			            })
					}
				})

			// setTimeout(function() {
			// 	setState(state => ({
			// 		...state,
			// 		loading: false
			// 	}))
			// 	props.navigation.navigate('CreatePin');
			// }, 100);
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
		        visible={state.loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
			<KeyboardAvoidingView 
				behavior='position'
				enabled={Platform.OS === 'ios' ? true : false}
			>
				<View style={styles.content}>
					<Image 
						source={require('../../assets/images/icon/smile.png')}
						style={styles.image}
						resizeMode='contain'
					/>
					<Animated.View style={[{ transform: [{translateX: bouncValue }] }]}>
						{ activePage === 1 && 
							<React.Fragment>
								<View style={[styles.btnView]}>
								<TextInput 
									placeholder='Masukkan nama lengkap kamu'
									style={styles.input}
									textAlign='center'
									autoCapitalize='words'
									value={data.nama}
									onChangeText={(text) => handleChange(text, 'nama')}
								/>
								<TextInput 
									placeholder='Masukkan alamat email'
									style={styles.input}
									textAlign='center'
									autoCapitalize='words'
									value={data.email}
									keyboardType='email-address'
									onChangeText={(text) => handleChange(text, 'email')}
								/>
							</View>

							<TouchableOpacity 
								style={[styles.btn, {marginTop: 7}]}
								activeOpacity={0.7}
								onPress={() => handleSubmit(2)}
							>
								<Text style={styles.text}>Selanjutnya</Text>
							</TouchableOpacity> 
						</React.Fragment> }

						{ activePage === 2 && 
							<View style={[styles.btnView, {height: wp('40%')}]}>
								<Text style={styles.text}>Apakah kamu pebisol?</Text>
								<TouchableOpacity 
									style={[styles.btn2]}
									activeOpacity={0.7}
									onPress={() => onPressPebisol(1)}
								>
									<Text style={styles.text}>Ya</Text>
								</TouchableOpacity> 
								<TouchableOpacity 
									style={[styles.btn2]}
									activeOpacity={0.7}
									onPress={() => onPressPebisol(2)}
								>
									<Text style={styles.text}>Bukan</Text>
								</TouchableOpacity> 
							</View> }

						{ activePage === 3 && 
							<React.Fragment>
								<View style={[styles.btnView]}>
								<TextInput 
									placeholder='Masukkan nama usaha'
									style={styles.input}
									textAlign='center'
									autoCapitalize='words'
									value={data.namaUsaha}
									onChangeText={(text) => handleChange(text, 'namaUsaha')}
								/>
								<TextInput 
									placeholder='Jenis usaha kamu'
									style={styles.input}
									textAlign='center'
									autoCapitalize='words'
									value={data.jenisUsaha}
									autoCapitalize='words'
									onChangeText={(text) => handleChange(text, 'jenisUsaha')}
								/>
							</View>

							<TouchableOpacity 
								style={[styles.btn, {marginTop: 7}]}
								activeOpacity={0.7}
								onPress={handleRegistrasi}
							>
								<Text style={styles.text}>Selanjutnya</Text>
							</TouchableOpacity> 
						</React.Fragment> }
					</Animated.View>
				</View>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		height: hp('55%'),
		width: wp('100%'),
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	image: {
		height: hp('30%'),
		width: wp('50%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	input: {
		backgroundColor: 'white',
		width: wp('80%'),
		height: hp('6%'),
		borderRadius: 30
	},
	btn:{
		width: wp('80%'),
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25,
		backgroundColor: '#fc9d03'
	},
	btn2:{
		width: wp('80%'),
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25,
		borderWidth: 1,
		borderColor: '#FFF'
	},
	btnView:{
		justifyContent: 'space-around', 
		alignItems: 'center',
		//backgroundColor: 'green',
		height: hp('15%')
	},
	lottie: {
	    width: 100,
	    height: 100
	}
});

export default connect(null, { setLocalUser })(CompleteRegistrasi);