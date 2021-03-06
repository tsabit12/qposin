import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Animated,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Image,
	StatusBar
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
	LacakView
} from './components';
import rgba from 'hex-to-rgba';
import api from '../../../../api';
import * as Location from 'expo-location';
import Loader from "../../../Loader";

const EmptyMessage = ({ onOrder }) => (
	<View style={styles.empty}>
		<Image 
			source={require('../../../../assets/images/empty.png')}
			resizeMode='contain'
			style={styles.image}
		/>
		<TouchableOpacity 
			style={styles.btnOrder} 
			activeOpacity={0.8}
			onPress={onOrder}
		>
			<Text style={{color: '#FFF'}}>Buat Order</Text>
		</TouchableOpacity>
	</View>
);

const ListQob = props => {
	const { error } = props;
	const [bounceValue] = useState(new Animated.Value(400));
	const [dataLacak, setDataLacak] = useState({
		data: [],
		extid: ''
	});

	const [pickupLoading, setPickupLoading] = useState({
		text: 'Loading...',
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
		setPickupLoading({
			text: 'Loading...',
			loading: true
		});

		api.lacakKiriman(extid)
			.then(traces => {
				setDataLacak(lacak => ({
					...lacak,
					data: traces,
					extid
				}))

				setPickupLoading(x => ({
					...x,
					loading: false
				}))
			})
			.catch(err => {
				stopLoadingPickup('Data kiriman tidak ditemukan')
			});
	}

	const handlePickup = async (order) => {
		let { status } = await Location.requestPermissionsAsync();
		setPickupLoading({
			text: 'Mencari titik lokasi...',
			loading: true
		});
		
		if (status !== 'granted') {
			stopLoadingPickup('Silahkan aktifkan permission location di pengaturan terlebih dahulu');
		}else{
			await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
				.then(location => {
					setPickupLoading(x => ({
						...x,
						text: 'Mencari driver...'
					}));
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
							console.log(err);
							if (err.msg) {
								stopLoadingPickup(err.msg);	
							}else{
								stopLoadingPickup(`Tidak dapat memproses permintaan anda`);	
							}
						})

				})
				.catch(err => {
					console.log(err);
					stopLoadingPickup('Titik lokasi tidak ditemukan');
				})
		}
	}

	const handleMultiplePickup = async () => {
		let { status } = await Location.requestPermissionsAsync();
		setPickupLoading({
			text: 'Mencari titik lokasi...',
			loading: true
		});

		if (status !== 'granted') {
			stopLoadingPickup('Silahkan aktifkan permission location di pengaturan terlebih dahulu');
		}else{
			await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High})
				.then(location => {
					setPickupLoading(x => ({
						...x,
						text: 'Mencari driver...'
					}));
					const { latitude, longitude } = location.coords;
					const choosed 		= props.list.filter(row => row.choosed === true);
					const item 			= [];
					const groupExtid 	= []; 
					choosed.forEach(row => {
						groupExtid.push(row.extid);
						item.push({
							extid: row.extid,
							itemtypeid: 1,
				            productid: row.productid,
				            valuegoods: row.valuegoods,
				            uomload: 5,
				            weight: row.weight,
				            uomvolumetric: 2,
				            length: row.length,
				            width: row.width,
				            height: row.height,
				            codvalue: row.codvalue,
				            fee: row.beadasar_htnb.split('|')[0],
				            feetax: row.ppn_ppnhtnb.split('|')[0],
				            insurance: row.beadasar_htnb.split('|')[1],
				            insurancetax: row.ppn_ppnhtnb.split('|')[1],
				            discount: 0,
				            desctrans: row.desctrans,
				            receiverzipcode: row.receiverzipcode
						})
					});
					const payload = {
						shipper: {
							userId: props.userid,
							name: choosed[0].shippername,
							latitude: latitude,
							longitude: longitude,
					        phone: choosed[0].shipperphone,
					        address: choosed[0].shipperaddress,
					        city: choosed[0].shippersubdistrict,
					        subdistrict: choosed[0].shippersubsubdistrict,
					        zipcode: choosed[0].shipperzipcode,
					        country: "Indonesia"
						},
						item: item
					}

					api.addPickup(payload)
						.then(res => {
							const { pickup_number } = res;
							const payloadUpdate = {
								pickupNumber: pickup_number,
								shipperLatlong: `${latitude}|${longitude}`,
								extid: groupExtid
							}
							props.onMultiplePickup(pickup_number, groupExtid);
							api.updateStatusPickup(payloadUpdate)
								.then(() => stopLoadingPickup(`Sukses pickup dengan nomor pickup ${pickup_number}`))
								.catch(() => stopLoadingPickup(`Update status  failed`));
						})
						.catch(err => {
							if (err.msg) {
								stopLoadingPickup(err.msg);	
							}else{
								stopLoadingPickup(`Tidak dapat memproses permintaan anda`);	
							}
						});
				})
				.catch(() => {
					stopLoadingPickup('Titik lokasi tidak ditemukan');
				})
		}
		
	}

	const stopLoadingPickup = (msg) => {
		setPickupLoading({
			text: '',
			loading: false
		})
		props.showToast(msg);
	}

	return(
		<View style={{flex: 1}}>
			{ error ? <EmptyMessage 
					onOrder={() => props.navigation.navigate('Order', { type: 2 })} 
				/> : <React.Fragment>
					{ props.list.length > 0 ? 
						<ListView 
							data={props.list} 
							onViewDetail={(order) => props.navigation.navigate('DetailOrder', {
								order
							})}
							lacakKiriman={handleLacak}
							onPickup={handlePickup}
							onMultiplePickup={handleMultiplePickup}
							getNewData={props.getNewData}
							onScroll={props.onScroll}
							onRefresh={props.handleRefresh}
							setChoosed={props.setChoosed}
						/> : <View style={styles.err}>
						<Text style={styles.textErr}>Loading...</Text>
					</View> }
				</React.Fragment> }			

			<Loader 
				loading={pickupLoading.loading} 
				text={pickupLoading.text} 
			/>

			{ pickupLoading.loading ? <StatusBar backgroundColor="rgba(0,0,0,0.5)"/> : <StatusBar backgroundColor="#C51C16"/> }

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
	},
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: wp('60%'),
		height: hp('40%')
	},
	btnOrder: {
		backgroundColor: '#C51C16',
		padding: 10,
		borderRadius: 30,
		width: wp('40%'),
		alignItems: 'center'
	}
})

ListQob.propTypes = {
	onPickup: PropTypes.func.isRequired,
	getNewData: PropTypes.func.isRequired,
	handleRefresh: PropTypes.func.isRequired,
	setChoosed: PropTypes.func.isRequired,
	onMultiplePickup: PropTypes.func.isRequired,
	showToast: PropTypes.func.isRequired
}

export default ListQob;