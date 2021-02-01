import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
	View, 
	Text,
	ImageBackground,
	TouchableOpacity,
	StyleSheet,
	AsyncStorage,
	StatusBar,
	Image,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Toast } from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import AnimatedLoader from "react-native-animated-loader";
import {
	RequestForm
} from './components';
import api from '../../api';
import { updateNorek } from '../../redux/actions/auth';
import { addMessage } from '../../redux/actions/message';
import { CommonActions } from '@react-navigation/native';

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


const ConnectGiroView = props => {
	const confirmRef = React.useRef();
	const [data, setData] = useState({
		isConfirm: false,
		errors: {},		
		pin: '',
		norek: '',
		message: ''
	});

	const [loading, setLoading] = useState(false);
	const { user } = props;

	useEffect(() => {
		(async () => {
			const value = await AsyncStorage.getItem("CONFIRMATION_GIRO");
			if (value !== null) {
				const toObj = JSON.parse(value);
				if (toObj.curdate === getCurdate()) { //only run when curdate is now
					setData(data => ({
						isConfirm: true,
						message: `Kode verifikasi telah dikirim ke nomor ${toObj.pgmPhone} melalui WhatsApp. (Berlaku sampai pukul 00:00)`,
						pin: toObj.pin,
						norek: toObj.norek
					}))
				}
			}
		})();
	}, [])

	const handleSubmitCode = (code) => {
		if (code !== data.pin) {
			confirmRef.current.clear();
			Toast.show({
                text: 'Kode verifikasi tidak valid',
                textStyle: { textAlign: 'center' },
                duration: 3000,
                position: 'top'
            })
		}else{
			setLoading(true);
			const param1 = `${user.userid}|${data.norek}|${data.pin}`;
			
			api.validateGiro(param1)
				.then(res => {
					AsyncStorage.removeItem('CONFIRMATION_GIRO');
					setLoading(false);
					setData(data => ({
						...data,
						isConfirm: false
					}))

					const { response_data5 } = res;
					props.updateNorek(data.norek, response_data5); //& saldo
					setTimeout(function() {
						props.navigation.dispatch(
						  CommonActions.reset({
						    index: 1,
						    routes: [
						      { name: 'Home' }
						    ],
						  })
						);
					}, 10);
				})
				.catch(err => {
					setLoading(false);
					if (err.global) {
						Toast.show({
			                text: err.global,
			                textStyle: { textAlign: 'center' },
			                duration: 3000,
			                position: 'top'
			            })
					}else{
						Toast.show({
			                text: 'Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi',
			                textStyle: { textAlign: 'center' },
			                duration: 3000,
			                position: 'top'
			            })
					}
				})
		}	
	}


	const handleRequest = (norek) => {
		setLoading(true);
		
		api.searchRekeningType(norek)
			.then(res => {
				api.connectToGiro(norek, user.userid)
					.then(res => {
						setLoading(false);

						const resValue 		= res.response_data1.split("|");
						const pgmPhone  	= res.response_data3;
						const kodeVerify 	= resValue[2];
						const curdate 		= getCurdate();

						const payload 	= {
							pin: kodeVerify,
							pgmPhone,
							curdate,
							norek: norek
						}
						const saving = saveSession(payload);
						if (saving) {
							setData(data => ({
								isConfirm: true,
								pin: kodeVerify,
								norek: norek,
								message: `Kode verifikasi telah dikirim ke nomor ${pgmPhone} melalui WhatsApp. (Berlaku sampai pukul 00:00)`,
							}))
						}else{
							props.addMessage(`(000) Gagal menyimpan data`, 'error');
						}

					})
					.catch(err => {
						setLoading(false);
						if (err.global) {
							props.addMessage(`(${err.status}) ${err.global}`, 'error');
						}else{
							props.addMessage(`(500) Internal server error`, 'error');
						}
					})	
			})
			.catch(err => {
				setLoading(false);
				if (err.global) {
					props.addMessage(`(${err.status}) ${err.global}`, 'error');
				}else{
					props.addMessage(`(500) Internal server error`, 'error');
				}
			})
	}	

	const saveSession = async (payload) => {
		try {
			await AsyncStorage.setItem('CONFIRMATION_GIRO', JSON.stringify(payload));
			return true;
		} catch (err) {
			return false;
		}
	}

	return(
		<ImageBackground 
			source={require('../../assets/images/background.png')} 
			style={{flex: 1}}
		>
			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
		    { loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }

			<View style={styles.header}>
				<TouchableOpacity 
					style={styles.btn} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>
					{ data.isConfirm ? 'Vertifikasi akun giro' : 'Hubungkan dengan akun giro'}
				</Text>
			</View>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={{
					justifyContent: 'center', 
					alignItems: 'center',
					flex: 1
				}}>
					<KeyboardAvoidingView 
						behavior='position'
						enabled={Platform.OS === 'ios' && !data.isConfirm ? true : false}
					>
						{ !data.isConfirm ? <React.Fragment>
								<Image
									style={styles.tinyLogo}
									resizeMode='contain'
									source={require('../../assets/images/hubrek.png')}
								/>
								<RequestForm onSubmit={handleRequest} />
							</React.Fragment> : 
							<View style={styles.verificationContent}>
								<View style={styles.card}>
									<Text style={styles.message}>{data.message}</Text>
								</View>
								<CodeInput
									keyboardType="numeric"
									ref={confirmRef}
									codeLength={6}
									space={20}
									size={40}
									className={'border-b'}
									autoFocus={false}
									codeInputStyle={{ fontWeight: '700' }}
									onFulfill={(code) => handleSubmitCode(code)}
									//containerStyle={{backgroundColor: 'black'}}
									codeInputStyle={{color: '#FFF'}}
									cellBorderWidth={2.0}
									inactiveColor='#FFF'
									activeColor='black'
								/>
							</View> }
					</KeyboardAvoidingView>
				</View>
			</TouchableWithoutFeedback>
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
	lottie: {
	    width: 100,
	    height: 100
	},
	btn: {
		width: wp('7%')
	},
	card: {
		backgroundColor: '#FFF',
		height: hp('10%'),
		justifyContent: 'center',
		alignItems: 'center',
		margin: 5,
		borderRadius: 5,
		elevation: 2
	},
	message: {
		textAlign: 'center',
		fontFamily: 'Nunito-Bold'
	},
	tinyLogo: {
		width: wp('80%'),
		height: hp('30%'),
		marginBottom: 30
	},
	verificationContent: {
		flex: 1,
		margin: 15
	}
})

ConnectGiroView.propTypes = {
	addMessage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	updateNorek: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		user: state.auth.localUser
	}
}

export default connect(mapStateToProps, { 
	updateNorek,
	addMessage
})(ConnectGiroView);