import React, { useEffect, useState } from 'react';
import { 
	View, 
	Text,
	ImageBackground,
	TouchableOpacity,
	StyleSheet,
	AsyncStorage,
	StatusBar,
	Image
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
						// props.navigation.dispatch(state => {
						//   const routes = state.routes.filter(r => r.name !== 'ConnectGiro');
						//   return CommonActions.reset({
						//     ...state,
						//     routes,
						//     index: routes.length - 1,
						//   });
						// });
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
							Toast.show({
				                text: 'FAILED!!',
				                textStyle: { textAlign: 'center' },
				                duration: 3000
				            })
						}

					})
					.catch(err => {
						console.log(err);
						setLoading(false);
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
			})
			.catch(err => {
				setLoading(false);
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
	}	

	// const checkRekening = async (norek) => {
	// 	const result = {};

	// 	await 

	// 	return result;
	// }

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
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Image
			        style={styles.tinyLogo}
			        resizeMode='contain'
			        source={require('../../assets/images/hubrek.png')}
			    />
				{ !data.isConfirm ? 
					<RequestForm onSubmit={handleRequest} /> : 
					<View>
						<View style={styles.card}>
							<Text style={styles.message}>{data.message}</Text>
						</View>
						<CodeInput
					      keyboardType="numeric"
					      ref={confirmRef}
					      codeLength={6}
					      space={20}
					      size={50}
					      className={'border-b'}
					      autoFocus={false}
					      codeInputStyle={{ fontWeight: '700' }}
					      onFulfill={(code) => handleSubmitCode(code)}
					      //containerStyle={{backgroundColor: 'black'}}
					      codeInputStyle={{color: '#FFF'}}
					      cellBorderWidth={2.0}
					      inactiveColor='#FFF'
					      activeColor='#db1a04'
					    />
					</View> }
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
		margin: 10,
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
	}
})

function mapStateToProps(state) {
	return{
		user: state.auth.localUser
	}
}

export default connect(mapStateToProps, { updateNorek })(ConnectGiroView);