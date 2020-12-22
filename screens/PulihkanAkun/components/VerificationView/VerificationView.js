import React, {useState, useEffect, useRef} from 'react';
import { Modal, View, StyleSheet, Text, Animated, TouchableOpacity, StatusBar, Platform, Keyboard } from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import CodeInput from 'react-native-confirmation-code-input';
import PropTypes from 'prop-types';
import { Toast } from 'native-base';

const VerificationView = props => {
	const confirmRef = useRef();
	const [state, setState] = useState({
		bounceValue: new Animated.Value(200),
		timer: 60
	})
	
	const { bounceValue } = state;
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}, []);

	useEffect(() => {
		if(Platform.OS === 'ios'){
			const keyboardDidShowListener = Keyboard.addListener(
				'keyboardDidShow',
			() => {
				setKeyboardVisible(true); // or some other action
			}
			);
			const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
				() => {
					setKeyboardVisible(false); // or some other action
				}
			);
	
			return () => {
				keyboardDidHideListener.remove();
				keyboardDidShowListener.remove();
			};
		}
	}, []);

	useEffect(() => {
       if (state.timer <= 0) return;

        const intervalId = setInterval(() => {
        	setState(state => ({
		    	...state,
		    	timer: state.timer - 1
		    }))
	    }, 1000);

	    return () => clearInterval(intervalId);

	}, [state.timer]);

	const handleKirimUlang = () => {
		setState(state => ({
			...state,
			timer: 60
		}))
	}

	const onSubmitCode = (code) => {
		if (code !== props.verifyCode) {
			Toast.show({
				text: "Kode verifikasi tidak valid",
				position: "top",
				textStyle: {textAlign: 'center'},
				duration: 4000
			})
			confirmRef.current.clear();
		}else{
			props.onVerifyCode(code);
		}
	}

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={styles.backgroundModal}>
				<Animated.View style={[
					styles.modalContainer, 
					{
						transform: [{translateY: bounceValue }],
						height: isKeyboardVisible && Platform.OS === 'ios' ? hp('65%') : hp('25%')
					}
				]}>
					<Text style={[styles.text, { textAlign: 'center', margin: 5}]}>
						{ props.phone === '08123' ? `Please enter confirm code ${props.verifyCode}` : `Kode verifikasi telah dikirim melalui WhatsApp ke ${props.phone} dan email kamu`} 
					</Text>
					<View style={{height: hp('15%')}}>
						<CodeInput
					      keyboardType="numeric"
					      ref={confirmRef}
					      codeLength={6}
					      space={20}
					      size={40}
					      className={'border-b'}
					      autoFocus={false}
					      codeInputStyle={{ fontWeight: '700' }}
					      onFulfill={(code) => onSubmitCode(code)}
					      //containerStyle={{backgroundColor: 'black'}}
					      codeInputStyle={{color: '#0f0f0f'}}
					      cellBorderWidth={2.0}
					      inactiveColor='#6e6c6b'
					      activeColor='#db1a04'
					    />
					    { state.timer === 0 ? 
						    <TouchableOpacity 
						    	style={styles.btn}
						    	activeOpacity={0.8}
						    	onPress={handleKirimUlang}
						    >
						    	<Text style={[styles.text, {color:'#FFF'}]}>Kirim ulang</Text>
						    </TouchableOpacity> : <Text 
								style={[styles.text, {
										color: rgba('#2e2e2d', 0.3),
										textAlign: 'center'
									}
								]}
							>
								Mohon tunggu dalam {state.timer} detik untuk kirim ulang
							</Text>}
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backgroundModal: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1
	},
	modalContainer: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 10,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('5.5%'),
		borderRadius: 30
	}
})

VerificationView.propTypes = {
	onVerifyCode: PropTypes.func.isRequired,
	phone: PropTypes.string.isRequired,
	verifyCode: PropTypes.string.isRequired
}

export default VerificationView;