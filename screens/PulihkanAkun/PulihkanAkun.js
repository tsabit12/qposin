import React, { useState, useRef } from 'react';
import { 
	View, 
	Text, 
	ImageBackground, 
	StyleSheet, 
	TouchableOpacity,
	TextInput
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon } from 'native-base';
import rgba from 'hex-to-rgba';
import AnimatedLoader from "react-native-animated-loader";
import {
	VerificationView
} from './components';

const PulihkanAkun = props => {
	const useridRef = useRef();
	const phoneRef = useRef();
	const emailRef = useRef();

	const [state, setState] = useState({
		data: {
			userid: '',
			phone: '',
			email: ''
		},
		errors: {},
		loading: false,
		showVerifyCode: false
	})

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

			setTimeout(function() {
				setState(state => ({
					...state,
					loading: false,
					showVerifyCode: true
				}))
			}, 3000);
		}
	}

	const validate = (field) => {
		const errors = {};

		if (!field.userid) errors.userid = 'Userid belum diisi';
		if (!field.phone) errors.phone = 'Nomor ponsel belum diisi';
		if (!field.email) errors.email = 'Alamat email belum diisi';

		return errors;
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
		    { state.showVerifyCode && 
		    	<VerificationView 
		    		onClose={() => setState(state => ({
		    			...state,
		    			showVerifyCode: false,
		    			data: {
		    				userid: '',
							phone: '',
							email: ''
		    			}
		    		}))}
		    		phone={data.phone}
		    	/> }
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>Pemulihan akun</Text>
			</View>
			<View style={styles.container}>
				<View style={styles.field}>
					<Text style={[styles.text, {marginLeft: 5}]}>Userid</Text>
					<TextInput 
						ref={useridRef}
						style={styles.input}
						placeholder='Masukkan userid anda'
						value={data.userid}
						onChangeText={(value) => handleChange('userid', value)}
						keyboardType='number-pad'
						returnKeyType='next'
						onSubmitEditing={() => phoneRef.current.focus()}
					/>
					{ errors.userid && <Text style={styles.textError}>{errors.userid}</Text>}
				</View>

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
					<Text style={styles.text}>Pulihkan</Text>
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

export default PulihkanAkun;