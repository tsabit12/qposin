import React, { useState, useEffect } from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	ImageBackground, 
	Image, 
	ScrollView, 
	StatusBar, 
	Platform, 
	TouchableOpacity,
	Animated,
	AsyncStorage,
	KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import Constants from 'expo-constants';
import { Icon, Toast } from 'native-base';
import {
	SliderImage,
	FormTarif,
	ModalToken,
	ModalLacak
} from './components';
import PropTypes from 'prop-types';
import AnimatedLoader from "react-native-animated-loader";
import api from '../../api';
import { resetOrder } from '../../redux/actions/order';
import { addMessage } from '../../redux/actions/message';

import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

import {Collapse,CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

async function registerForPushNotificationsAsync() {
  	let token;
    
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
	  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
	}
	
    if (finalStatus !== 'granted') {
      //alert('Failed to get push token for push notification!');
      	Toast.show({
	        text: 'Untuk mendapatkan notifikasi, aktifkan izin notifikasi di pengaturan ponsel anda',
	        textStyle: { textAlign: 'center' },
	        duration: 3000
	    })
      return;
    }

   	token = (await Notifications.getExpoPushTokenAsync()).data;

  	if (Platform.OS === 'android') {
    	Notifications.setNotificationChannelAsync('qposin-messages', {
	      name: 'Notifications messages',
	      importance: Notifications.AndroidImportance.MAX,
	      vibrationPattern: [0, 250, 250, 250], 
	      lightColor: '#FF231F7C',
	    });
  	}

  return token;
}

const MenuView = props => {
	const scrollRef = React.useRef();

	const [expoPushToken, setExpoPushToken] = useState('');
	const [stateLacak, setLacak] = useState({
		visible: false,
		lacakList: [],
		nomor: ''
	})

	const [state, setState] = useState({
		loading: false,
		positionTarif: new Animated.Value(0),
		tarifVisible: false,
		showToken: false,
		tokenValue: ''
	})
	//const [mount, setMount] = useState(false);

	const { order, local } = props;

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => setExpoPushToken(token))
			.catch(err => {
				console.log(err);
				//setMount(true);
			})
	}, []);

	//update expo token to database
	useEffect(() => {
		if (expoPushToken !== '') {
			const payload = {
    			token: expoPushToken,
    			email: local.email,
    			userid: local.userid,
    			phone: local.nohp
			};
			
    		api.pushToken(payload);
    			// .then(res => {
    			// 	setMount(true);
    			// })
    			// .catch(err => {
    			// 	console.log(err);
    			// 	setMount(true);
    			// })
		}
	}, [expoPushToken]);

	// useEffect(() => {
	// 	if (mount) {
	// 		(async () => {
	// 			const { norek } = user;
	// 			if (norek !== '-') {
	// 				const fuckingValue = await AsyncStorage.getItem('isCodBaru'); //define user was syncronize 
	// 				if (fuckingValue === null) { //web required to syncronize user when using cod
	// 					handleAsyncGiro(local, user);
	// 				}
	// 			}
	// 		})();
	// 	}
	// }, [mount])

	useEffect(() => {
		if (state.tarifVisible) {
			Animated.timing(state.positionTarif, {
				toValue: 100,                   // Animate the value
      			duration: 500,
      			useNativeDriver: true
			}).start();
		}
	}, [state.tarifVisible])

	useEffect(() => {
		if (order.kecamatanA) {
			setState(state => ({
				...state,
				tarifVisible: true
			}))
		}else if(order.kecamatanB){
			setState(state => ({
				...state,
				tarifVisible: true
			}))
		}
	}, [order]);

	//handle redirect lacak
	useEffect(() => {
		if (props.route.params) {
			const { lacakList, nomor } = props.route.params;
			setLacak(lacak => ({
				...lacak,
				lacakList,
				nomor,
				visible: true
			}))
			// setLacakList(lacakList);
			// setLacak(true);
		}
	}, [props.route.params])

	const handleCekTarif = (param) => {
		setState(state => ({
			...state,
			loading: true
		}))

		api.getTarif(param)
			.then(res => {
				setState(state => ({
					...state,
					loading: false
				}))
				const response = res.split('#');
				setTimeout(function() {
					props.navigation.navigate('Tarif', {
						data: response
					})
				}, 10);
			})
			.catch(err => {
				setState(state => ({
					...state,
					loading: false
				}))

				if (err.global) {	
					props.addMessage(`(${err.status}) ${err.global}`, 'error');
				}else{
					props.addMessage(`(500) Internal server error`, 'error');
				}
			})
	}

	const handlePressOrder = (type) => {
		props.resetOrder();
		setTimeout(function() {
			props.navigation.navigate('Order', {
				type
			});
		}, 10);
	}

	const onGenerateToken = async () => {
		setState(state => ({
			...state,
			loading: true
		}))

		const { userid } 	= props.local;
		// const userid 	= '22882';
		const email 		= props.user.email;
		
		try {
			const getPin = await api.generateToken(userid);
			if(getPin.rc_mess === '00'){
				api.syncronizeUserPwd({ email, pin: getPin.response_data1 })
					.then(response => {
						console.log({response});
						// console.log('oke');
						setState(state => ({
							...state,
							showToken: true,
							loading: false,
							tokenValue: getPin.response_data1
						}))
					})
					.catch(error => {
						console.log(error.response);
						setState(state => ({ ...state, loading: false }));
						if (error.response) {
							console.log("first err");
							props.addMessage(`Terdapat kesalahan! error code (${error.response.status})`, 'error');
						} else if (error.request) {
							console.log("second err");
							props.addMessage(`Could not connect to server`, 'error');
						} else {
							console.log("last err");
							props.addMessage(`Error ${error.message}`, 'error');
						}
					})
			}else{
				setState(state => ({ ...state, loading: false }));
				props.addMessage(`(${getPin.rc_mess}) ${getPin.desk_mess}`, 'error');
			}
		} catch (error) {
			setState(state => ({ ...state, loading: false }));
			if (error.response) {
				props.addMessage(`Terdapat kesalahan! error code (${error.response.status})`, 'error');
				// console.log(error.response.data);
			} else if (error.request) {
				props.addMessage(`Could not connect to server`, 'error');
			} else {
				props.addMessage(`Error ${error.message}`, 'error');
			}
		}
		

		// api.generateToken(userid)
		// 	.then(res => {
		// 		const payload = {
		// 			email: email,
		// 			pin: res.response_data1
		// 		};

		// 		api.syncronizeUserPwd(payload)
		// 			.then(res2 => {
		// 				setState(state => ({
		// 					...state,
		// 					loading: false,
		// 					showToken: true,
		// 					tokenValue: res.response_data1
		// 				}))
		// 			})
		// 			.catch(err => {
						
		// 				setError(`(${err.respcode ? err.respcode : '500'})\nTidak dapat memproses permintaan anda, mohon coba beberapa saat lagi`);
		// 			})
		// 	})
		// 	.catch(err => {
		// 		if (err.global) {
		// 			setError(err.global)
		// 		}else{
		// 			setError('Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi');
		// 		}
		// 	})
	}

	const setError = (msg) => {
		setState(state => ({
			...state,
			loading: false
		}));
		Toast.show({
            text: msg,
            textStyle: { textAlign: 'center' },
            duration: 3000
        })
	}

	// const handleAsyncGiro = async (local, session) => {
	// 	api.generateToken(local.userid)
	// 		.then(pin => {
	// 			const payload = {
	// 				email: session.email,
	// 				pin: pin.response_data1
	// 			}

	// 			api.syncronizeUserPwd(payload)
	// 				.then(res => {
	// 					//keep send
	// 					if (res.respcode === '21' || res.respcode === '00') {
	// 						const payloadSyncGiro = {
	// 							email: session.email,
	// 							norek: session.norek
	// 						}
	// 						api.syncronizeCod(payloadSyncGiro)
	// 							.then(async lastResponse => {
	// 								try{
	// 									await AsyncStorage.setItem('isCodBaru', JSON.stringify(true));
	// 									Toast.show({
	// 								        text: 'Sinkronisasi giro sukses!',
	// 								        textStyle: { textAlign: 'center' },
	// 								        duration: 2000
	// 								    })	
	// 								}catch(lastFuckingError){
	// 									console.log(lastFuckingError);
	// 								}
	// 							})
	// 					}
	// 				})
	// 			// console.log(payload);
	// 		})
	// 	//console.log({ local, session });
	// }

	const handleCallHaloPos = () => {
		const url = `tel:161`;
		Linking.canOpenURL(url)
			.then((supported) => {
				if(supported){
					return Linking.openURL(url);
				}else{
					alert('Silahkan hubungi call center kami di 161')
				}
			})
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
		    { state.loading &&  <StatusBar backgroundColor="rgba(0,0,0,0.6)"/> }

		    { state.showToken && 
		    	<ModalToken 
		    		onClose={() => setState(state => ({
		    			...state,
		    			showToken: false
		    		}))} 
		    		value={state.tokenValue} 
		    	/> }

		    { stateLacak.visible && 
		    	<ModalLacak 
		    		onClose={() => setLacak(lacak => ({
		    			...lacak,
		    			visible: false,
		    			lacakList: [],
		    			nomor: ''
		    		}))} 
		    		navigateBarcode={() => props.navigation.navigate('ScanBarcode')}
		    		list={stateLacak.lacakList}
		    		nomor={stateLacak.nomor}
		    	/> }

			<View style={styles.header}>
				<Image 
					source={require('../../assets/images/icon/qposin.png')}
					style={styles.qposin}
					resizeMode='contain'
				/>
				<TouchableOpacity 
					style={{flexDirection: 'row'}} activeOpacity={0.7}
					onPress={() => props.navigation.navigate('Profile')}
				>
					<Icon 
						name='md-person' 
						style={{
							color: '#FFF', 
							fontSize: 30,
							marginRight: 5
						}} 
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.content}>
				<KeyboardAvoidingView 
					behavior='padding'
					keyboardVerticalOffset={70}
					enabled={Platform.OS === 'ios' ? true : false}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'handled'}
						ref={scrollRef}
						//onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}
					>
						<View style={styles.slider}>
							<SliderImage />
						</View>
						<View style={[styles.hr, { marginTop: 0}]} />
						
							<Collapse
								onToggle={(isCollapsed) => setState(state => ({
									...state,
									tarifVisible: isCollapsed
								}))}
								isCollapsed={state.tarifVisible}
							>
								<CollapseHeader>
								<View 
									style={{
										height: hp('5.2%'),
										alignItems: 'center',
										flexDirection: 'row',
										justifyContent: 'space-between',
										width: wp('97%'),
										paddingTop: 5
									}}
									// activeOpacity={0.7}
									// onPress={() => setState(state => ({
									// 	...state,
									// 	tarifVisible: !state.tarifVisible
									// }))}
								>
									<Text style={styles.subTitle}>Mau kirim kemana?</Text>
									{ state.tarifVisible ? 
										<Ionicons name="ios-arrow-down" size={20} color="black" /> : 
										<Ionicons name="ios-arrow-forward" size={20} color="black" />
									}
								</View>
								</CollapseHeader>
								<CollapseBody>
									<FormTarif 
										// animatedValue={state.positionTarif}
										navigate={props.navigation.navigate}
										values={order}
										onSubmit={handleCekTarif}
									/>
								</CollapseBody>
							</Collapse>
						<View style={styles.hr} />
						
						<Text style={styles.subTitle}>Layanan yang kamu butuhkan</Text>
						<View style={{alignItems: 'center', flex: 1}}>
							<View style={{marginTop: 5}}>
								<View style={[styles.menu]}>

									<TouchableOpacity 
										style={styles.icon}
										activeOpacity={1}
										onPress={() => props.navigation.navigate('CityCourier')}
									>
										<View style={[styles.image, styles.elevationImage]}>
											<Image 
												style={styles.image}
												source={require('../../assets/images/icon/q9plus.png')} 
												resizeMode='contain'
											/>
										</View>
										<Text style={styles.textLabel}>City{'\n'}Courier</Text>
									</TouchableOpacity>

									<TouchableOpacity 
										style={[styles.icon]}
										activeOpacity={1}
										onPress={() => handlePressOrder(1)}
									>
										<View style={[styles.image, styles.elevationImage]}>
											<Image 
												style={styles.image}
												source={require('../../assets/images/icon/qcom.png')} 
												resizeMode='contain'
											/>
										</View>
										<Text style={styles.textLabel}>Kiriman{'\n'}E-Commerce</Text>
									</TouchableOpacity>

									<TouchableOpacity 
										style={styles.icon}
										activeOpacity={1}
										onPress={() => handlePressOrder(2)}
									>
										<View style={[styles.image, styles.elevationImage]}>
											<Image 
												style={styles.image}
												source={require('../../assets/images/icon/qob.png')} 
												resizeMode='contain'
											/>
										</View>
										<Text style={styles.textLabel}>Online{'\n'}Booking</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.menu}>

								<TouchableOpacity 
									style={styles.icon}
									activeOpacity={1}
									onPress={() => setLacak(lacak => ({
										...lacak,
										visible: true
									}))}
								>
									<View style={[styles.image, styles.elevationImage]}>
										<Image 
											style={styles.image}
											source={require('../../assets/images/icon/lacak.png')} 
											resizeMode='contain'
										/>
									</View>
									<Text style={styles.textLabel}>Lacak{'\n'}Kiriman</Text>
								</TouchableOpacity>

								<TouchableOpacity 
										style={styles.icon}
										activeOpacity={1}
										onPress={() => props.navigation.navigate('History')}
									>
									<View style={[styles.image, styles.elevationImage]}>
										<Image 
											style={styles.image}
											source={require('../../assets/images/icon/history.png')} 
											resizeMode='contain'
										/>
									</View>
									<Text style={styles.textLabel}>History{'\n'}Kiriman</Text>
								</TouchableOpacity>

								<TouchableOpacity 
									style={styles.icon}
									activeOpacity={1}
									onPress={onGenerateToken}
								>
									<View style={[styles.image, styles.elevationImage]}>
										<Image 
											style={styles.image}
											source={require('../../assets/images/icon/token.png')} 
											resizeMode='contain'
										/>
									</View>
									<Text style={styles.textLabel}>Generate{'\n'}Password Web</Text>
								</TouchableOpacity>
								
							</View>

							<View style={[styles.menu]}>
								<TouchableOpacity 
									style={styles.icon}
									activeOpacity={1}
									onPress={handleCallHaloPos}
								>
									<View style={[styles.image, styles.elevationImage]}>
										<Image 
											style={styles.image}
											source={require('../../assets/images/icon/call.png')} 
											resizeMode='contain'
										/>
									</View>
									<Text style={styles.textLabel}>Halo POS</Text>
								</TouchableOpacity>

							</View>
						</View>
						<View style={styles.footer}>
							<Text style={{
								fontFamily: 'Nunito',
								fontSize: 13
							}}>Version {Constants.manifest.version}</Text>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	header: {
		height: hp('10%'),
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 15,
		marginRight: 15,
		paddingTop: Constants.statusBarHeight,
		justifyContent: 'space-between',
	},
	content: {
		flex: 1,
		backgroundColor: 'white',
	},
	title: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
		fontSize: 20
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
	},
	slider: {
		// backgroundColor: 'green',
		height: hp('31%')
	},
	icon: {
		height: hp('12%'),
		width: wp('28%'),
		borderRadius: 20,
		margin: 5,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 1, 
		
	},
	menu: {
		height: hp('16%'),
		width: wp('90%'), 
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'center',
		//backgroundColor: 'red',
	},
	hr: {
		width: wp('100%'),
		height: hp('0.4%'),
		backgroundColor: rgba('#c4c4c4', 0.4),
		marginTop: 10,
		//elevation: 2
	},
	lottie: {
	    width: 100,
	    height: 100
	},
	image: {
		// width: wp('30%'),
		height: hp('8%'),
		width: wp('20%')
	},
	qposin: {
		width: wp('38%'),
		height: hp('30%')
	},
	textLabel: {
		textAlign: 'center',
		marginTop: 5,
		fontSize: 12,
		color:'black',
		fontFamily: 'Nunito'
	},
	subTitle: {
		fontFamily: 'Nunito-semi',
		marginLeft: 6
	},
	elevationImage: {
		elevation: 2, 
		borderRadius: 12, 
		backgroundColor: 'white'
	},
	footer: {
		alignItems:'center',
		justifyContent: 'center',
		height: hp('5%'),
		// backgroundColor: '#f0f2f1'
	}
})

MenuView.propTypes = {
	user: PropTypes.object.isRequired,
	order: PropTypes.object.isRequired,
	addMessage: PropTypes.func.isRequired,
	resetOrder: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		user: state.auth.session,
		order: state.order,
		local: state.auth.localUser
	}
}

export default connect(mapStateToProps, { 
	resetOrder,
	addMessage
})(MenuView);