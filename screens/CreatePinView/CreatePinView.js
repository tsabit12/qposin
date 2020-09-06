import React, { useEffect, useState } from 'react';
import { 
	View, 
	Text, 
	ImageBackground, 
	StyleSheet,
	Image,
	TextInput,
	BackHandler,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import md5 from "react-native-md5";
import Constants from 'expo-constants';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Toast } from 'native-base';
import { connect } from 'react-redux';
import { updatePin } from '../../redux/actions/auth';
import { CommonActions } from '@react-navigation/native';
import AnimatedLoader from "react-native-animated-loader";
import api from '../../api';

const CreatePinView = props => {
	const [pin, setPin] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
		    
	    return () => {
	      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
	    };
	}, [handleBackButtonClick]);

	const handleBackButtonClick = () => {
		Toast.show({
            text: 'Registrasi belum selesai, harap masukan kode keamanan terlebih dahulu',
            textStyle: { textAlign: 'center' },
            duration: 3000
        })
		return true;
	}

	const handleSubmit = () => {
		const errors = validate(pin);
		setErrors(errors);
		if (Object.keys(errors).length === 0) {
			setLoading(true);
			ubahPin();
		}		
	}

	const ubahPin = async () => {
		const value = await AsyncStorage.getItem("qobUserPrivasi");
		if (value !== null) {
			const localUser = JSON.parse(value);
			const rumusPin  = md5.hex_md5(localUser.userid+pin+localUser.nohp+localUser.email+Constants.deviceId+'8b321770897ac2d5bfc26965d9bf64a1');
			const param1 	= `${localUser.userid}|${rumusPin}`;
			api.updatePin(param1)
				.then(res => {
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
		}else{
			Toast.show({
	            text: 'Gagal mengambil data',
	            textStyle: { textAlign: 'center' },
	            duration: 3000
	        })
		}
	}

	const handleSuccesUpdate = async (newLocaluser) => {
		await AsyncStorage.setItem('qobUserPrivasi', JSON.stringify(newLocaluser));
		props.updatePin(newLocaluser);

		setLoading(false);
		setSuccess(true);
	}

	const validate = (pinValue) => {
		const errors = {};
		if (!pinValue) {
			errors.pin = 'Pin belum diisi';
		}else if(pinValue.length !== 6){
			errors.pin = 'Pin harus 6 digit';
		}

		return errors;
	}

	const handleLogin = () => {
		props.navigation.dispatch(state => {
		  // Remove ubahpin route from the stack
		  const routes = state.routes.filter(r => r.name !== 'CreatePin');

		  return CommonActions.reset({
		    ...state,
		    routes,
		    index: routes.length - 3,
		  });
		});
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
			<View style={styles.content}>
				<Image 
					source={require('../../assets/images/icon/security.png')}
					style={styles.image}
					resizeMode='contain'
				/>
				{ !success ? <React.Fragment>
					<View style={[styles.btnView]}>
						<Text style={[styles.text, { textAlign: 'center', marginLeft: 10, marginRight: 10}]}>
							Tambahkan keamanan ekstra dengan PIN (6 digit) sesuai keinginanmu
						</Text>
						<TextInput 
							placeholder='Masukkan 6 digit pin disini'
							style={styles.input}
							textAlign='center'
							autoCapitalize='words'
							keyboardType='number-pad'
							value={pin}
							onChangeText={(text) => {
								setErrors({pin: undefined});
								setPin(text);
							}}
						/>
						{ errors.pin && <Text style={{color: '#FFF'}}>{errors.pin}</Text> }
					</View>
					<TouchableOpacity 
						style={[styles.btn, {marginTop: 7}]}
						activeOpacity={0.7}
						onPress={handleSubmit}
					>
						<Text style={styles.text}>Selesai</Text>
					</TouchableOpacity> 
				</React.Fragment> : <View style={[styles.btnView]}>
						<Text style={[styles.text, { textAlign: 'center', marginLeft: 10, marginRight: 10}]}>
							Registrasi sukses, PIN login kamu adalah ({pin})
						</Text>
						<TouchableOpacity 
							style={[styles.btn, {marginTop: 7}]}
							activeOpacity={0.7}
							onPress={handleLogin}
						>
							<Text style={styles.text}>Menu utama</Text>
						</TouchableOpacity> 
				</View> }
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
})

export default connect(null, { updatePin })(CreatePinView);