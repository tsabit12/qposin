import React, { useState, useEffect } from 'react';
import {
	View, 
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Alert
} from 'react-native';
import MapView, { Marker, AnimatedRegion }from 'react-native-maps';
import PropTypes from 'prop-types';
import { Icon } from 'native-base';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import axios from 'axios';
import { Fontisto } from '@expo/vector-icons'; 
import * as Linking from 'expo-linking';

const url = 'https://fastpos-1531122403865.firebaseio.com/faster-locations';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE = -6.9160014;
const LONGITUDE = 107.6571561;
const LATITUDE_DELTA = 0.01; 
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const convertPhone = (phone) => {
	const firstNumber = phone.substring(0, 1);
	if (firstNumber === '0') {
		return `+62${phone.substring(1, 15)}`;
	}else{
		return phone;
	}
	//return phone.substring(0, 1);
} 

const MarkerLabel = props => {
	return(
         <View style={styles.container}>
	        <View style={styles.bubble}>
	          <Text style={styles.amount}>Pickuper</Text>
	        </View>
	        <View style={styles.arrowBorder} />
        	<View style={styles.arrow} />
	    </View>
	);
}

const MapComponent = props => {
	const { notification, sender } = props;

	const [location, setLocation] = useState({
		latitude: sender.lat,
		longitude: sender.lon,
		latitudeDelta: LATITUDE_DELTA,
		longitudeDelta: LONGITUDE_DELTA
	}) 

	const [ locationFaster ] = React.useState(new AnimatedRegion({
		latitude: LATITUDE,
		longitude: LONGITUDE,
		latitudeDelta: 0,
    	longitudeDelta: 0,
	}))

	const [ locationSender ] = React.useState(new AnimatedRegion({
		latitude: sender.lat,
		longitude: sender.lon,
		latitudeDelta: 0,
    	longitudeDelta: 0,
	}))

	const [state, setState] = useState({})
	const [loop, setLooptime] = useState(2000);

	useEffect(() => { 
		const { body, title } = notification;
		const arr = body.split(':');
		if (arr.length === 4) {
			setState({
				phone: arr[3].trim(),
				id: arr[1].split('(')[1].substring(0, 12)
			}); 
		}else{
			const arr2 = body.split(',');
			if (arr2.length > 0) {
				if (arr2[0] === `Order ${title} telah selesai`) {
					Alert.alert(
				      "Notifikasi",
				      `${body}`,
				      [
				        { text: "OK", onPress: () => props.onDone() }
				      ],
				      { cancelable: false }
				    );
				}
			}
		}
		// else{
		// 	const arr2 = body.split(',');
		// 	if (arr2.length > 0) {
		// 		if (arr2[0] === `Order ${} telah selesai`) {}
		// 	}
		// }
	}, [notification])
 
	useEffect(() => {
		if (state.id) {
			const timer = setTimeout(function() {
				setLooptime(loop - 1);
				

				axios.get(`${url}/${state.id}.json`)
					.then(res => {
						const { data } = res;
						if (data !== null) {
							const { latitude, longitude } = res.data;

							const newCoordinate = {
						      latitude: latitude,
						      longitude: longitude,
						      latitudeDelta: 0,
					          longitudeDelta: 0
						    };

							setLocation({
								latitude: latitude,
								longitude: longitude,
								latitudeDelta: LATITUDE_DELTA,
								longitudeDelta: LONGITUDE_DELTA
							})

							locationFaster.timing(newCoordinate).start();
						}
					});
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [state, loop]);

	const handlePressWa = () => {
		const phone = convertPhone(state.phone);
		Linking.openURL(`https://wa.me/+${phone}`);
	}
 
	return(
		<View style={{flex: 1}}>
			<MapView 
				region={{
					latitude: location.latitude,
		            longitude: location.longitude,
		            latitudeDelta: location.latitudeDelta,
		            longitudeDelta: location.longitudeDelta,
				}} 
				style={styles.map}
				showsUserLocation={true}
				// onRegionChangeComplete={handleCompleteRegion}
				// onRegionChange={handleChangeRegion}
				zoomControlEnabled={false}
			>
				<Marker.Animated coordinate={locationFaster}>
					<MarkerLabel name='Pengirim'/>
				</Marker.Animated>

				<Marker.Animated coordinate={locationSender}>
					<View style={styles.container}>
						<View style={[styles.bubble, {backgroundColor: 'red'}]}>
				          <Text style={styles.amount}>Pengirim</Text>
				        </View>
				        <View style={[styles.arrowBorder, {borderTopColor: 'red', borderColor: 'transparent'}]} />
			        	<View style={[styles.arrow]} />
		        	</View>
				</Marker.Animated>
			</MapView>
			<TouchableOpacity 
				style={styles.btn}
				onPress={handlePressWa}
			>
				<Fontisto name="whatsapp" size={30} color="#FFF" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	map: {
    	...StyleSheet.absoluteFillObject,
    	flex: 1
  	},
  	btn: { 
  		backgroundColor: '#029c23',
  		width: wp('15%'),
  		height: wp('15%'),
  		justifyContent: 'center',
  		alignItems: 'center',
  		borderRadius: wp('15%') / 2,
  		position: 'absolute',
  		bottom: 0,
  		right: 0,
  		margin: 15
  	},
  	arrow: {
		backgroundColor: 'transparent',
		borderWidth: 6,
		borderColor: 'transparent',
		borderTopColor: 'orange',
		alignSelf: 'center',
		marginTop: -9,
	},
	arrowBorder: {
		backgroundColor: 'transparent',
		borderWidth: 4,
		borderColor: 'transparent',
		borderTopColor: 'orange',
		alignSelf: 'center',
		marginTop: -0.5,
	},
	bubble: {
	    flex: 0,
	    flexDirection: 'row',
	    alignSelf: 'flex-start',
	    backgroundColor: 'orange',
	    padding: 2,
	    borderRadius: 3,
	    borderColor: 'orange',
	    borderWidth: 0.5,
	},
	amount: {
		color: '#FFF',
		fontFamily: 'Nunito-Bold'
	}
})

MapComponent.propTypes = {
	notification: PropTypes.object.isRequired,
	onDone: PropTypes.func.isRequired
}

export default MapComponent;