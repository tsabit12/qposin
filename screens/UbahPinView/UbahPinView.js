import React, { useRef, useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	ImageBackground,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import { Icon, Toast } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import PinView from 'react-native-pin-view';
import AnimatedLoader from "react-native-animated-loader";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from "react-native-md5";
import Constants from 'expo-constants';
import api from '../../api';
import { updatePin } from '../../redux/actions/auth';
import { CommonActions } from '@react-navigation/native';

const UbahPinView = props => {
	const refPinView = useRef();
	const [state, setState] = useState({
		data: {
			pin: '',
			confirm: ''
		},
		isConfirm: false,
		enteredPin: '',
		showRemoveButton: false,
		loading: false
	})

	const { data, isConfirm, enteredPin, showRemoveButton } = state;

	useEffect(() => {
		if (enteredPin.length === 6 && isConfirm) {
			setState(state => ({
				...state,
				data: {
					...state.data,
					confirm: enteredPin
				},
				enteredPin: ''
			}))
			refPinView.current.clearAll();
		}else if(enteredPin.length === 6 && !isConfirm){
			setState(state => ({
				...state,
				data: {
					...state.data,
					pin: enteredPin
				},
				enteredPin: '',
				isConfirm: true
			}))
			refPinView.current.clearAll();
		}else{
			if (enteredPin.length > 0) {
				setState(state => ({
					...state,
					showRemoveButton: true
				}))
		    }else{
		      	setState(state => ({
					...state,
					showRemoveButton: false
				}))
		    }
		}
	}, [enteredPin, isConfirm]);

	useEffect(() => {
		if (data.confirm.length === 6) {
			validatePin(data.confirm, data.pin);
		}
	}, [data.confirm])

	const validatePin = async (confirmCode, pinCode) => {
		if (confirmCode !== pinCode) {
			Toast.show({
                text: 'Pin tidak sesuai',
                textStyle: { textAlign: 'center' },
                duration: 3000
            })
		}else{
			const { localUser } = props;
			setState(state => ({
				...state,
				loading: true
			}))

			const rumusPin  = md5.hex_md5(localUser.userid+pinCode+localUser.nohp+localUser.email+Constants.deviceId+'8b321770897ac2d5bfc26965d9bf64a1');
			const param1 	= `${localUser.userid}|${rumusPin}`;
			api.updatePin(param1)
				.then(res => {
					console.log(res);
					const newLocaluser = {
						userid: localUser.userid,
						username: '-',
						nama: localUser.nama,
						nohp: localUser.nohp,
						email: localUser.email,
						pinMd5: rumusPin
					};

					handleSuccesUpdate(newLocaluser);
				})
				.catch(err => {
					console.log(err);
					setState(state => ({
						...state,
						loading: false
					}))

					Toast.show({
		                text: 'Terdapat kesalahan, mohon coba beberapa saat lagi',
		                textStyle: { textAlign: 'center' },
		                duration: 3000
		            })
				})
		}
	}

	const handleChangePin = (value) => {
		setState(state => ({
			...state,
			enteredPin: value
		}))
	}

	const handleReset = () => {
		refPinView.current.clearAll();
		setState(state => ({
			...state,
			isConfirm: false
		}))
	}

	const handleSuccesUpdate = async (newLocaluser) => {
		await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(newLocaluser));
		props.updatePin(newLocaluser);

		setState(state => ({
			...state,
			loading: false
		}))

		Toast.show({
            text: 'Ubah pin sukses',
            textStyle: { textAlign: 'center' },
            duration: 3000
        })

		setTimeout(function() {
			props.navigation.dispatch(state => {
			  // Remove ubahpin route from the stack
			  const routes = state.routes.filter(r => r.name !== 'Ubahpin');

			  return CommonActions.reset({
			    ...state,
			    routes,
			    index: routes.length - 1,
			  });
			});
		}, 10);
	}

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={{flex: 1}}
		>	
			<AnimatedLoader
		        visible={state.loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					Ubah PIN
				</Text>
			</View>
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text style={[styles.text, {marginBottom: 10}]}>
					{isConfirm ? 'Konfirmasi PIN' : 'Masukkan PIN baru'} 
				</Text>
				<PinView
					ref={refPinView}
		            onValueChange={value => handleChangePin(value)}
		            pinLength={6}
		            buttonSize={75}
		            inputSize={32}
		            buttonAreaStyle={{
		              marginTop: 24,
		            }}
		            inputAreaStyle={{
		              marginBottom: 24,
		            }}
		            inputViewEmptyStyle={{
		              backgroundColor: "transparent",
		              borderWidth: 1,
		              borderColor: "#FFF",
		            }}
		            inputViewFilledStyle={{
		              backgroundColor: "#FFF",
		            }}
		            buttonViewStyle={{
		              backgroundColor: "#FFF",
		              margin: 6
		            }}
		            buttonTextStyle={{
		              color: "black"
		            }}
		            onButtonPress={key => {
		              if (key === "custom_right") {
		                handleReset();
		              }else{
		              	refPinView.current.clear();
		              }
		            }}
		            customLeftButton={showRemoveButton ? 
		            	<Icon name={"ios-backspace"} 
		            		style={{
		            			fontSize: 40,
		            			color: 'white'
		            		}}
		            	/> : undefined}
		            customRightButton={isConfirm ? 
		            	<Icon name={"ios-refresh"} 
		            		style={{
		            			fontSize: 40,
		            			color: 'white'
		            		}}
		            	/> : undefined}
		        />
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		// backgroundColor: 'white',
		alignItems: 'center',
		marginLeft: 20
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	btn: {
		width: wp('7%'),
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

UbahPinView.propTypes = {
	localUser: PropTypes.object.isRequired,
	updatePin: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		localUser: state.auth.localUser
	}
}

export default connect(mapStateToProps, { updatePin })(UbahPinView);