import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Animated,
	StyleSheet,
	TouchableOpacity,
	TextInput
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon, Toast } from 'native-base';
import PropTypes from 'prop-types';
import {
	MonthView,
	ListView,
	LacakView,
	PickupLoading
} from './components';
import rgba from 'hex-to-rgba';
import api from '../../../../api';
import AnimatedLoader from "react-native-animated-loader";
import * as Location from 'expo-location';

const ListQob = props => {
	const { error } = props;
	const [bounceValue] = useState(new Animated.Value(400));
	const [dataLacak, setDataLacak] = useState({
		loading: false,
		data: [],
		extid: ''
	});
	const [pickupLoading, setPickupLoading] = useState({
		text: '',
		loading: false
	});

	useEffect(() => {
		Animated.spring(bounceValue, {
			toValue: 0,
			useNativeDriver: true,
			friction: 8,
			delay: 100
		}).start();
	}, []);

	const handleLacak = (extid) => {
		setDataLacak(lacak => ({
			...lacak,
			loading: true
		}))

		api.lacakKiriman(extid)
			.then(traces => {
				setDataLacak(lacak => ({
					...lacak,
					loading: false,
					data: traces,
					extid
				}))
			})
			.catch(err => {
				setDataLacak(lacak => ({
					...lacak,
					loading: false
				}))
				Toast.show({
		            text: 'Data kiriman tidak ditemukan',
		            textStyle: { textAlign: 'center' },
		            duration: 3000
		        })
			});
	}

	const handlePickup = async (order) => {
		let { status } = await Location.requestPermissionsAsync();
		setPickupLoading({
			text: 'Mencari posisi kamu...',
			loading: true
		});
		
		if (status !== 'granted') {
			stopLoadingPickup('Silahkan aktifkan permission location di pengaturan terlebih dahulu');
		}else{
			await Location.getCurrentPositionAsync({})
				.then(location => {
					const { latitude, longitude } = location.coords;
					const payload = {
						shipper: {
							userId: props.userid,
							name: order.shippername,
							latitude: latitude,
							longitude: longitude,
					        phone: order.shipperphone,
					        address: order.shipperaddress,
					        city: order.shippersubdistrict,
					        subdistrict: order.shippersubsubdistrict,
					        zipcode: order.shipperzipcode,
					        country: "Indonesia"
						},
						item: [{
							extid: order.extid,
							itemtypeid: 1,
				            productid: order.productid,
				            valuegoods: order.valuegoods,
				            uomload: 5,
				            weight: order.weight,
				            uomvolumetric: 2,
				            length: order.length,
				            width: order.width,
				            height: order.height,
				            codvalue: order.codvalue,
				            fee: order.beadasar_htnb.split('|')[0],
				            feetax: order.ppn_ppnhtnb.split('|')[0],
				            insurance: order.beadasar_htnb.split('|')[1],
				            insurancetax: order.ppn_ppnhtnb.split('|')[1],
				            discount: 0,
				            desctrans: order.desctrans,
				            receiverzipcode: order.receiverzipcode
						}]
					}
				
							

					api.addPickup(payload)
						.then(res => {
							const { pickup_number } = res;
							props.onPickup(pickup_number, order.extid);
							
							const payloadUpdate = {
								pickupNumber: pickup_number,
								shipperLatlong: `${latitude}|${longitude}`,
								extid: [order.extid]
							}

							api.updateStatusPickup(payloadUpdate)
								.then(() => stopLoadingPickup(`Sukses pickup dengan nomor pickup ${pickup_number}`))
								.catch(() => stopLoadingPickup(`Update status failed`));
						})
						.catch(err => {
							if (err.msg) {
								stopLoadingPickup(err.msg);	
							}else{
								stopLoadingPickup(`Tidak dapat memproses permintaan anda`);	
							}
						})

				})
				.catch(err => {
					stopLoadingPickup('Posisi kamu belum kami dapatkan, silahkan cobalagi');
				})
		}
	}

	const stopLoadingPickup = (msg) => {
		setPickupLoading(x => ({
			...x,
			text: msg
		}))

		setTimeout(function() {
			setPickupLoading({
				text: '',
				loading: false
			})
		}, 3000);
	}

	return(
		<View style={{flex: 1}}>
			<AnimatedLoader
		        visible={dataLacak.loading}
		        overlayColor="rgba(0,0,0,0.6)"
		        source={require("../../../../assets/images/loader/3098.json")}
		        animationStyle={styles.lottie}
		        speed={1}
		    />
			{ error ? 
				<View style={styles.err}>
					<Text style={styles.textErr}>{error}</Text>
				</View> :  
				<React.Fragment>
					{ props.list.length > 0 ? 
						<ListView 
							data={props.list} 
							onViewDetail={(order) => props.navigation.navigate('DetailOrder', {
								order
							})}
							lacakKiriman={handleLacak}
							onPickup={handlePickup}
							getNewData={props.getNewData}
							onScroll={props.onScroll}
							onRefresh={props.handleRefresh}
						/> : <View style={styles.err}>
						<Text style={styles.textErr}>Loading...</Text>
					</View> }
				</React.Fragment> }			

			{ dataLacak.data.length > 0 && 
				<LacakView 
					data={dataLacak.data} 
					onClose={() => setDataLacak(lacak => ({
						...lacak,
						data: [],
						extid: ''
					}))}
					extid={dataLacak.extid}
				/> }

			{ pickupLoading.loading && <PickupLoading text={pickupLoading.text} /> }

		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#c91c0c',
		height: hp('10%'),
		justifyContent: 'space-between',
		padding: 5,
		paddingLeft: 10,
		// borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	btn: {
		backgroundColor: 'white',
		height: hp('8.5%'),
		justifyContent: 'center',
		borderRadius: 8,
		padding: 5,
		width: wp('14%'),
		alignItems: 'center'
	},
	err: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textErr: {
		color: rgba('#87888a', 0.7),
		textAlign: 'center'
	},
	lottie: {
	    width: 100,
	    height: 100
	}
})

ListQob.propTypes = {
	onPickup: PropTypes.func.isRequired,
	getNewData: PropTypes.func.isRequired,
	handleRefresh: PropTypes.func.isRequired
}

export default ListQob;