import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	ImageBackground, 
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Animated
} from 'react-native';
import Constants from 'expo-constants';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import Hr from "react-native-hr-component";
import {
	ConfirmView
} from './components';
import api from '../../api';


const ErrorLabel = props => {
	const shakeAnimation = new Animated.Value(0);

	useEffect(() => {
		Animated.sequence([
	      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
	      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
	      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
	      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
	      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
	      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
	    ]).start();
	}, []);

	return(
		<Animated.View style={{ transform: [{translateX: shakeAnimation}]}}>
			<Text style={[styles.label, {marginTop: 7, color: rgba('#FFF', 0.6)}]}>
				{props.text}
			</Text>
		</Animated.View>
	);
}

const FormRegister = props => {
	const [state, setState] = useState({
		phone: '',
		errors: {},
		modalVisible: false
	})

	const { errors } = state;

	const handleSubmit = () => {
		const errors = validate(state.phone);
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

	const validate = (phone) => {
		const errors = {};
		if (!phone) errors.phone = 'Nomor ponsel belum diisi';
		return errors;
	}

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={styles.root}
		>	
			{ state.modalVisible && 
				<ConfirmView 
					phone={state.phone} 
					onClose={() => setState(state => ({
						...state,
						modalVisible: false
					}))}
					callApi={(payload) => api.sendWhatsApp(payload)}
				/> }
			<View style={styles.form}>
				<Text style={styles.label}>Nomor Ponsel</Text>
				<TextInput 
					style={styles.input}
					textAlign='center'
					placeholder='Masukan nomor ponsel'
					keyboardType='phone-pad'
					value={state.phone}
					onChangeText={(value) => setState(state => ({
						...state,
						phone: value,
						errors: {
							...state.errors,
							phone: undefined
						}
					}))}
				/>
				{ errors.phone ? 
					<ErrorLabel text={errors.phone} /> : 
					<Text style={[styles.label, {marginTop: 7, color: rgba('#FFF', 0.6)}]}>
						Contoh: 08XXXXXXXXXX
					</Text> }
			</View>
			<View style={{justifyContent: 'space-around', height: hp('20%')}}>
				<View  style={{height: hp('6.8%')}}>
					<TouchableOpacity 
						style={[styles.btn, {backgroundColor: '#ffac30'}]}
						activeOpacity={0.6}
						onPress={handleSubmit}
					>
						<Text style={styles.text}>Daftar</Text>
					</TouchableOpacity>
				</View>
				<Hr 
			    	lineColor={rgba('#FFF', 0.7)} 
			    	width={1} 
			    	textPadding={10} 
			    	text="atau" 
			    	textStyles={styles.hr} 
			    	hrPadding={10}
			    />
			    <View  style={{height: hp('6.8%')}}>
					<TouchableOpacity 
						style={[styles.btn, {borderWidth: 0.6, borderColor: '#FFF'}]}
						activeOpacity={0.6}
						onPress={() => props.navigation.push('Restore')}
					>
						<Text style={styles.text}>Pulihkan akun</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	input: {
		backgroundColor: 'white',
		width: wp('90%'),
		height: hp('6%'),
		borderRadius: 25
	},
	form: {
		padding: 20,
		height: hp('20%'),
		// backgroundColor: 'green'
	},
	label: {
		color: '#FFF',
		margin: 6
	},
	btn: {
		width: wp('90%'),
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25
	},
	hr: {
		color: rgba('#FFF', 0.8)
	}
})

export default FormRegister;