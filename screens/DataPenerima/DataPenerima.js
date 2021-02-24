import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
	View, 
	Text, 
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	StatusBar,
	AsyncStorage
} from 'react-native';
import { Icon } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import {
	ResultView,
	SyncComponent
} from './components';
import { connect } from 'react-redux';
import AnimatedLoader from "react-native-animated-loader";
import api from '../../api';
import { CommonActions } from '@react-navigation/native';
import { resetOrder } from '../../redux/actions/order';
import { addMessage } from '../../redux/actions/message';
import * as Location from 'expo-location';
import { pushUserDataToWeb, setIsSync } from '../../helper';
import { set } from 'react-native-reanimated';

const DataPenerima = props => {
	const [ state, setState ] = useState({
		data: {
			nama: '',
			email: '',
			phone: '',
			street: ''
		},
		modalVisible: false,
		errors: {},
		loading: false
	})
	const [isSyncWeb, setIsSyncWeb] = useState(true);

	const { data: dataProps, type: typeMenu } = props.route.params;
	const { data, errors } = state;

	useEffect(() => {
		(async () => {
			try {
				const isSyncWeb = await AsyncStorage.getItem('isSyncWeb');
				if(isSyncWeb === null){
					setState(state => ({
						...state,
						loading: true
					}))

					const { email, userid } = props.user.localUser;
					
					pushUserDataToWeb(userid, email)
						.then(() => {
							setIsSync(true);

							setState(state => ({
								...state,
								loading: false
							}))
						})
						.catch(err => {
							const { code, errorMsg } = err;
							props.addMessage(`(${code}) ${errorMsg}`, 'error');
							setIsSyncWeb(false);

							setState(state => ({
								...state,
								loading: false
							}))
						})
				}

			} catch (error) {
				props.addMessage('(112) Error fetching storage', 'error');
			}
		})();
	}, []);


	const handleChange = (text, name) => setState(state => ({
		...state,
		data: {
			...state.data,
			[name]: text
		},
		errors: {
			...state.errors,
			[name]: undefined
		}
	}))

	const handleSubmitPenerima = () => {
		const errors = validate(state.data);
		setState(state => ({
			...state,
			errors
		}))

		if (Object.keys(errors).length === 0) {
			setState(state => ({
				...state,
				modalVisible: true
			}))
		}
	}

	const validate = (field) => {
		const errors = {};

		if (!field.nama) errors.nama = 'Nama belum diisi';
		if (!field.phone) errors.phone = 'Nomor handphone belum diisi';
		if (!field.street) errors.street = 'Alamat utama belum diisi';

		return errors;
	}

	const getLocation = async (payload) => {

		setState(state => ({
			...state,
			modalVisible: false,
			loading: true
		}))

		const { localUser, session } = props.user;
		const compltedPayload = {
			...payload,
			email: localUser.email,
			customerid: localUser.userid,
			shippername: session.nama,
			shipperemail: localUser.email,
			"shipperphone": localUser.nohp,
			"receivername": data.nama,
			"receiveraddress": data.street,
			"receiveremail": data.email ? data.email : '-',
			"receiverphone": data.phone,
			"shipperaddress": session.alamatOl,
			latitude: '',
			longitude: ''
		}

		let { status } = await Location.requestPermissionsAsync();
		
		if(status !== 'granted'){
			props.addMessage('Permission to access location was denied', 'error');
		}else{
			let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
			compltedPayload.latitude = location.coords.latitude;
			compltedPayload.longitude = location.coords.longitude;
		}

		addOrder(compltedPayload);
	}

	const addOrder = async (payload) => {
		try {
			const saveOrder = await api.qob.booking(payload);
			const { respcode, transref, respmsg } = saveOrder;
			if(respcode === '000'){
				if(typeMenu === 1){
					props.navigation.replace('ChoosePickup', {
						...transref
					})
				}else{
					props.addMessage(`(${respcode}) ${respmsg}`, 'success');
					backHome();
				}
			}else{
				props.addMessage(`(${respcode}) ${respmsg}`, 'error');
			}
		} catch (error) {
			if(error.response){
				props.addMessage(`(${error.response.status}) Terdapat kesalahan`, 'error');
			}else if(error.request){
				props.addMessage('(400) Request error', 'error');
			}else{
				props.addMessage('(500) Internal server error', 'error');
			}
		}

		setState(state => ({
			...state,
			loading: false
		}))
	}

	const backHome = () => {
		props.resetOrder();
		setTimeout(function() {
			props.navigation.dispatch(
			  CommonActions.reset({
			    index: 0,
			    routes: [
			      {
			        name: 'Home'
			      },
			    ],
			  })
			);
		}, 10);
	}

	const handleSyncWeb = async () => {
		setState(state => ({
			...state,
			loading: true
		}))

		const { userid, email } = props.user.localUser;

		try {
			await pushUserDataToWeb(userid, email);	
			setIsSync(true); //save to storage
			setIsSyncWeb(true); //live reload state
		} catch (error) {
			const { code, errorMsg } = error;
			props.addMessage(`(${code}) ${errorMsg}`, 'error');
		}

		setState(state => ({
			...state,
			loading: false
		}))
	}
	
	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={styles.root}
		>		
			{ state.modalVisible && 
				<ResultView 
					dataOrder={dataProps} 
					onClose={() => setState(state => ({
						...state,
						modalVisible: false
					}))}
					onOrder={getLocation}
				/> }

			<AnimatedLoader
		        visible={state.loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    { state.loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }

			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					Kirim {dataProps.jenis === '1' ? 'paket' : 'surat'} ke siapa?
				</Text>
			</View>
			{ !isSyncWeb ? <SyncComponent onSubmit={handleSyncWeb} /> : 
				<ScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
					<View style={{flex: 1, backgroundColor: '#FFF', alignItems: 'center'}}>
						<View style={styles.form}>
							<View style={styles.field}>
								<Text style={styles.label}>Nama</Text>
								<TextInput 
									style={styles.input}
									value={data.nama}
									placeholder='Masukkan nama penerima'
									onChangeText={(text) => handleChange(text, 'nama')}
									autoCapitalize='words'
								/>
								{ errors.nama && <Text style={styles.labelErr}>{errors.nama}</Text> }
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Alamat utama</Text>
								<TextInput 
									style={styles.input}
									value={data.street}
									placeholder='Contoh: jln xxx no 12'
									onChangeText={(text) => handleChange(text, 'street')}
									autoCapitalize='none'
								/>
								{ errors.street && <Text style={styles.labelErr}>{errors.street}</Text> }
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Email <Text style={{color: rgba('#4d4d4d', 0.6)}}>(optional)</Text></Text>
								<TextInput 
									style={styles.input}
									placeholder='Masukkan email penerima'
									keyboardType='email-address'
									autoCapitalize='none'
									value={data.email}
									onChangeText={(text) => handleChange(text, 'email')}
								/>
							</View>

							<View style={styles.field}>
								<Text style={styles.label}>Nomor handphone</Text>
								<TextInput 
									style={styles.input}
									placeholder='Masukkan nomor handphone penerima'
									value={data.phone}
									keyboardType='phone-pad'
									onChangeText={(text) => handleChange(text, 'phone')}
								/>
								{ errors.phone && <Text style={styles.labelErr}>{errors.phone}</Text> }
							</View>
							<TouchableOpacity 
								style={styles.button}
								activeOpacity={0.7}
								onPress={handleSubmitPenerima}
							>
								<Text style={styles.text}>Selanjutnya</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView> }
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
	btn: {
		width: wp('7%'),
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	form: {
		width: wp('92%'),
		//backgroundColor: 'green',
		flex: 1,
		marginTop: 10
	},
	input: {
		borderRadius: 30,
		//backgroundColor: 'red',
		height: hp('6%'),
		borderWidth: 0.3,
		paddingLeft: 10
	},
	field: {
		height: hp('12%'),
		justifyContent: 'space-around',
	},
	label: {
		marginLeft: 8,
		fontFamily: 'Nunito-Bold'
	},
	button: {
		backgroundColor: '#c73504',
		height: hp('6.6%'),
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	},
	labelErr: {
		marginLeft: 8,
		color: 'red'
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

function mapStateToProps(state) {
	return{
		user: state.auth 
	}
}

export default connect(mapStateToProps, { 
	resetOrder,
	addMessage
})(DataPenerima);