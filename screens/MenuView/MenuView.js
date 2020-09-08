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
	Animated
} from 'react-native';
import { connect } from 'react-redux';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import rgba from 'hex-to-rgba';
import Constants from 'expo-constants';
import { Icon, Toast, List, ListItem, Left, Right } from 'native-base';
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

import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

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
      alert('Failed to get push token for push notification!');
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
	// const [showLacak, setLacak] = useState(false);
	// const [lacakList, setLacakList ] = useState([]);

	const [state, setState] = useState({
		loading: false,
		positionTarif: new Animated.Value(0),
		tarifVisible: false,
		showToken: false,
		tokenValue: ''
	})

	const { user, order } = props;

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
	}, []);

	//update expo token to database
	useEffect(() => {
		if (expoPushToken !== '') {
			const { local } = props;
			const payload = {
    			token: expoPushToken,
    			email: local.email,
    			userid: local.userid,
    			phone: local.nohp
    		};
    		api.pushToken(payload)
    			.then(res => console.log(res))
    			.catch(err => console.log(err))
		}
	}, [expoPushToken]);

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
		if (!props.route.params) {
			console.log('kosong');
		}else{
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
					Toast.show({
		                text: err.global,
		                textStyle: { textAlign: 'center' },
		                duration: 3000
		            })
				}else{
					Toast.show({
		                text: 'Network Error',
		                textStyle: { textAlign: 'center' },
		                duration: 3000
		            })
				}
			})
	}

	const handlePressOrder = (type) => {
		props.navigation.navigate('Order', {
			type
		});

		setTimeout(function() {
			props.resetOrder();
		}, 100);
	}

	const onGenerateToken = () => {
		setState(state => ({
			...state,
			loading: true
		}))

		const { userid, email } = props.local;
		api.generateToken(userid)
			.then(res => {
				const payload = {
					email: email,
					pin: res.response_data1
				};
				api.syncronizeUserPwd(payload)
					.then(res2 => {
						setState(state => ({
							...state,
							loading: false,
							showToken: true,
							tokenValue: res.response_data1
						}))
					})
					.catch(err => {
						setError('Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi (500)');
					})
			})
			.catch(err => {
				if (err.global) {
					setError(err.global)
				}else{
					setError('Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi');
				}
			})
	}

	const setError = (msg) => {
		setState(state => ({
			...state,
			loading: false
		}));
		Toast.show({
            text: 'Tidak dapat memproses permintaan anda, mohon coba beberapa saat lagi',
            textStyle: { textAlign: 'center' },
            duration: 3000
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
				<ScrollView
					showsVerticalScrollIndicator={false}
					ref={scrollRef}
					//onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}
				>
					<View style={styles.slider}>
						<SliderImage />
					</View>
					<View style={[styles.hr, { marginTop: 0}]} />

					<TouchableOpacity 
						style={{
							height: hp('5.2%'),
							alignItems: 'center',
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: wp('95%'),
							paddingTop: 5
						}}
						activeOpacity={0.7}
						onPress={() => setState(state => ({
							...state,
							tarifVisible: !state.tarifVisible
						}))}
					>
						<Text style={styles.subTitle}>Mau Kirim Kemana?</Text>
						{ state.tarifVisible ? 
							<Ionicons name="ios-arrow-down" size={24} color="black" /> : 
							<Ionicons name="ios-arrow-forward" size={24} color="black" />}
					</TouchableOpacity>
					

					{ state.tarifVisible && <FormTarif 
						animatedValue={state.positionTarif}
						navigate={props.navigation.navigate}
						values={order}
						onSubmit={handleCekTarif}
					/> }

					<View style={styles.hr} />
					
					<Text style={styles.subTitle}>Layanan yang Kamu Butuhkan</Text>
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
									<Text style={styles.textLabel}>City {'\n'}Courier</Text>
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
									<Text style={styles.textLabel}>Kiriman E-Commerce</Text>
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
									<Text style={styles.textLabel}>Online {'\n'}Booking</Text>
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
								<Text style={styles.textLabel}>Lacak {'\n'}Kiriman</Text>
							</TouchableOpacity>

							<TouchableOpacity 
									style={styles.icon}
									activeOpacity={1}
									// onPress={() => props.navigation.navigate('CityCourier')}
								>
								<View style={[styles.image, styles.elevationImage]}>
									<Image 
										style={styles.image}
										source={require('../../assets/images/icon/history.png')} 
										resizeMode='contain'
									/>
								</View>
								<Text style={styles.textLabel}>History {'\n'}Kiriman</Text>
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
								<Text style={styles.textLabel}>Generate Password Web</Text>
							</TouchableOpacity>
							
						</View>

						<View style={[styles.menu]}>
							<TouchableOpacity 
								style={styles.icon}
								activeOpacity={1}
								onPress={() => Linking.openURL('tel:' + '161')}
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
				</ScrollView>
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
		height: hp('30%')
	},
	icon: {
		height: hp('12%'),
		width: wp('28%'),
		borderRadius: 20,
		margin: 5,
		//justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 0.2,
		//backgroundColor: 'green',
		// elevation: 1,
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
		height: hp('0.7%'),
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
		//fontFamily: 'Nunito-Bold'
	},
	subTitle: {
		fontFamily: 'Nunito-Bold',
		marginLeft: 6,
		color: rgba('#3d3c3c', 0.7)
	},
	elevationImage: {
		elevation: 2, 
		borderRadius: 12, 
		backgroundColor: 'white'
	}
})

MenuView.propTypes = {
	user: PropTypes.object.isRequired,
	order: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return{
		user: state.auth.session,
		order: state.order,
		local: state.auth.localUser
	}
}

export default connect(mapStateToProps, { resetOrder })(MenuView);