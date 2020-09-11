import React, { useEffect, useState, useRef } from 'react';
import { 
	View, 
	Text, 
	Modal, 
	StyleSheet, 
	TouchableOpacity,
	Animated,
	StatusBar
} from 'react-native';
import { Icon } from 'native-base';
import rgba from 'hex-to-rgba';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import PropTypes from 'prop-types';
import CodeInput from 'react-native-confirmation-code-input';

const convertPhone = (phone) => {
	//skip first number (0)
	const removeFirstNumber = phone.substring(1,15); 
	return `62${removeFirstNumber}`;
}

const VerficationForm = props => {
	const bounceValue = new Animated.Value(-100);
	const confirmRef = useRef();
	const [code, setCode] = useState('');
	const [timer, setTimer] = useState(60);

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      duration: 1000,
	      friction: 8
	    }).start();
	}, []);

	useEffect(() => {
       if (timer <= 0) return;

        const intervalId = setInterval(() => {
        	setTimer(timer - 1);
	    }, 1000);

	    return () => clearInterval(intervalId);

	}, [timer]);

	const handleChangeCode = (val) => {
		if (Number(val) !== Number(props.code)) {
			alert(`Invalid kode verifikasi`);
			confirmRef.current.clear();
		}else{
			props.onDone(props.phone);
		}
	}

	const handleResend = () => {
		setTimer(60);
		props.onResendCode();
	}

	return(
		<Animated.View style={[styles.main, {transform: [{translateX: bounceValue}] }]}>
			<Text style={[styles.text, {fontSize: 17, marginBottom: 10} ]}>Masukkan Kode Verifikasi</Text>
			<Text style={[styles.text, {color: rgba('#949494', 0.7)}]}>Kode verifikasi telah dikirim melalui WhatsApp ke {props.phone}</Text>
			<CodeInput
		      keyboardType="numeric"
		      ref={confirmRef}
		      codeLength={4}
		      space={20}
		      size={50}
		      className={'border-b'}
		      autoFocus={false}
		      codeInputStyle={{ fontWeight: '700' }}
		      onFulfill={(code) => handleChangeCode(code)}
		      //containerStyle={{backgroundColor: 'black'}}
		      codeInputStyle={{color: '#0f0f0f'}}
		      cellBorderWidth={2.0}
		      inactiveColor='#6e6c6b'
		      activeColor='#db1a04'
		    />
		    { timer === 0 ? 
		    	<TouchableOpacity 
					style={[styles.btn]} 
					activeOpacity={0.6}
					onPress={handleResend}
				>
					<Text style={[styles.text, {color: '#FFF'}]}>
						Kirim ulang kode verifikasi
					</Text>
				</TouchableOpacity> : <Text style={[styles.text, {color: rgba('#949494', 0.7), marginTop: 10}]}>
					Mohon tunggu dalam {timer} detik untuk kirim ulang
				</Text> }
		</Animated.View>
	);
}

const ConfirmView = props => {
	const bounceValue = new Animated.Value(200);
	const [state, setState] = useState({
		loading: false,
		success: false,
		code: Math.floor(1000 + Math.random() * 9000),
		activePage: 1
	})

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}, [])

	// const handleClose = () => {
	// 	Animated.spring(bounceValue, {
	//       toValue: 200,
	//       useNativeDriver: true,
	//       tension: 2,
	//       friction: 8
	//     }).start();

	//     setTimeout(function() {
	//     	props.onClose();
	//     }, 500);
	// }

	const handleSend = () => {
		const convertedPhone = convertPhone(props.phone);

		const payload = {
			phone: convertedPhone,
			body: `QPOSIN: untuk pembuatan akun, masukkan kode verifikasi ${state.code}`
		};

		setState(state => ({
			...state,
			loading: true
		}))

		props.getLinkWa(payload)
			.then(res => {
				setState(state => ({
					...state,
					loading: false,
					success: true
				}))	
			})
			.catch(err => {
				setState(state => ({
					...state,
					loading: false,
					success: true
				}))
			})
	}	

	//console.log(state.code);

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
		>
			<View style={styles.modalBackground}>
				<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
				<Animated.View style={[styles.content, {transform: [{translateY: bounceValue }] }]}>
					<View style={styles.right}>
						<TouchableOpacity onPress={props.onClose}>
							<Icon name='close' style={{color: '#7a7d7b'}}/>
						</TouchableOpacity>
					</View>
					{ state.success ? 
						<VerficationForm 
							phone={props.phone} 
							code={state.code}
							onResendCode={handleSend}
							onDone={(phone) => props.onDone(phone)}
						/> : 
						<Animated.View style={styles.main}>
							<Text style={[styles.text, {fontSize: 17, marginBottom: 10}]}>Verifikasi</Text>
							<Text style={styles.text}>Kode verifikasi akan dikirim melalui WhatsApp ke {props.phone}</Text>
							<TouchableOpacity 
								style={styles.btn} 
								activeOpacity={0.6}
								onPress={handleSend}
								disabled={state.loading}
							>
								<Text style={[styles.text, {color: '#FFF'}]}>
									{state.loading ? 'Loading....' : `WhatsApp ke ${props.phone}`}
								</Text>
							</TouchableOpacity>
					</Animated.View> }
				</Animated.View>
			</View>
		</Modal>
	);
}

ConfirmView.propTypes = {
	phone: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	onDone: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	modalBackground: {
		backgroundColor: 'rgba(0,0,0,0.5)', 
		flex: 1
	},
	content: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		padding: 10,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	right: {
		justifyContent: 'flex-end', 
		flexDirection: 'row',
		margin: 6,
		marginRight: 10
	},
	main: {
		alignItems: 'center'
	},
	text: {
		textAlign: 'center',
		fontFamily: 'Nunito-Bold'
	},
	btn: {
		backgroundColor: '#db1a04',
		width: wp('90%'),
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25,
		margin: 7,
		marginTop: 12
	}
})

ConfirmView.propTypes = {
	// sendWa: PropTypes.func.isRequired,
	getLinkWa: PropTypes.func.isRequired
}

export default ConfirmView;