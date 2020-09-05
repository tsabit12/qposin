import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, StatusBar, Platform } from 'react-native';
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
	FormTarif
} from './components';
import PropTypes from 'prop-types';
import AnimatedLoader from "react-native-animated-loader";
import api from '../../api';

import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

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
	const [expoPushToken, setExpoPushToken] = useState('');

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

	const [state, setState] = useState({
		loading: false
	})

	const { user, order } = props;

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

			<View style={styles.header}>
				<Text style={styles.title}>QPOSin AJA</Text>
				<View style={{flexDirection: 'row'}}>
					<Text style={[styles.text, {fontSize: 17}]}>
						Halo {capitalize(user.nama.replace(/ .*/,''))}
					</Text>
					<Icon name='md-person' style={{marginLeft: 8, color: '#FFF', fontSize: 24}} />
				</View>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
			>
			<View style={styles.content}>
				<View style={styles.slider}>
					<SliderImage />
				</View>
				
				<FormTarif 
					navigate={props.navigation.navigate}
					values={order}
					onSubmit={handleCekTarif}
				/>

				<View style={styles.hr} />
				
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<View style={styles.menu}>
						<View style={styles.icon} />
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/lacak.png')} />
						</View>
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/history.png')} />
						</View>
					</View>
					<View style={styles.menu}>
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/token.png')} />
						</View>
						<View style={styles.icon}>
							<Image source={require('../../assets/images/icon/call.png')} />
						</View>
					</View>
				</View>
			</View>
			</ScrollView>
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
		height: hp('10%'),
		width: wp('20%'),
		backgroundColor: 'white',
		borderRadius: 18,
		elevation: 3,
		margin: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	menu: {
		height: hp('15%'),
		width: wp('100%'), 
		padding: 20,
		//backgroundColor: 'red',
		flexDirection: 'row',
		alignItems: 'center'
		//justifyContent: 'space-between'
		//backgroundColor: 'red',
	},
	hr: {
		width: wp('100%'),
		height: hp('0.1%'),
		backgroundColor: rgba('#FFF', 1),
		marginTop: 10,
		marginBottom: 5,
		elevation: 2
	},
	lottie: {
	    width: 100,
	    height: 100
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

export default connect(mapStateToProps, null)(MenuView);