import React, { useState, useEffect, useRef } from 'react';
import { 
	View, 
	Text,
	StatusBar,
	StyleSheet,
	ImageBackground
} from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import * as Notifications from 'expo-notifications';
import {
	MapComponent,
	ErrorMessage
} from './components';
import api from '../../api';

const FindDriverView = props => {
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [notification, setNotification] = useState(false);
	const [errors, setError] = useState({});
	const [time, setTimer] = useState(60);
	const responseListener = useRef();
	const notificationListener = useRef();
	const { params } = props.route;

	useEffect(() => {
		if (params.payload) {
			const { payload } = params;
			api.cityCourier.order(payload)
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					setError({
						order: 'Terdapat kesalahan saat melakukan order'
					})
					setLoading(false);
				})
		}
	}, [params]);

	useEffect(() => {
		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
	    });

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
	      console.log(response);
	    });

	    return () => {
	      Notifications.removeNotificationSubscription(notificationListener);
	      Notifications.removeNotificationSubscription(responseListener);
	    };
	}, []);

	useEffect(() => {
		if (notification) {
			setLoading(false);
			setError({});
			setTimer(0);
			return;
		}else{
			if (time <= 0) {
				setError({
					order: 'Pickuper tidak ditemukan'
				})
				setLoading(false);
				return;
			}
		}

		const intervalId = setInterval(() => {
        	setTimer(time - 1);
	    }, 1000);

	    return () => clearInterval(intervalId);
	}, [time, notification])

	const handleOrder = () => {
		setLoading(true);
		setTimer(60);

		const { payload } = params;

		api.cityCourier.order(payload)
			.then(res => {
				console.log(res);
				// setTimer(0);
			})
			.catch(err => {
				setError({
					order: 'Terdapat kesalahan saat melakukan order'
				})

				setTimeout(function() {
					setLoading(false);
				}, 1000);
			})
	}

	return( 
		<View style={{flex: 1}}>
			<ImageBackground 
				source={require('../../assets/images/background.png')} 
				style={styles.header}
			>	
				<Text style={styles.title}>
					{ loading ? 'Mencari Pickuper...' : <React.Fragment>{errors.order ? 'Oppps' : 'Pickuper Ditemukan'}</React.Fragment> }
				</Text>
			</ImageBackground>

			{ time > 0 && <View style={styles.card}>
				<Text style={styles.subTitle}>Mohon tunggu dalam {time} detik untuk melakukan bidding ulang</Text>
			</View> }

			<AnimatedLoader
		        visible={loading}
		        overlayColor="rgba(0,0,0,0.0)"
		        source={require("../../assets/images/loader/radar2.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
			
			{ !loading && <React.Fragment>
				{ errors.order ? 
					<ErrorMessage 
						text={errors.order} 
						onOrder={handleOrder} 
					/> : 
					<MapComponent 
			    		notification={notification.request.content}
			    		sender={params.payload.param2.source}
			    		onDone={() => props.navigation.goBack()}
			    	/> }
			</React.Fragment> }

		</View>
	);
}

const styles = StyleSheet.create({
	lottie: {
		height: 500,
		width: 500
	},
	header: {
		height: hp('10%'),
		//backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		color: '#FFF',
		fontFamily: 'Nunito-Bold',
		fontSize: 17,
		marginTop: 20
	},
	subTitle: {
		// color: '#FFF',
		fontFamily: 'Nunito',
		textAlign: 'center'
	},
	card: {
		backgroundColor: '#e3e3e3',
		margin: 5,
		height: hp('8%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		padding: 5
	}
})

export default FindDriverView;