import React from 'react';
import { 
	View, 
	Text,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Icon } from 'native-base';
import rgba from 'hex-to-rgba';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const DetailOrder = props => {
	const { order } = props.route.params;
	// console.log(order);
	return(
		<View style={{flex: 1}}>
			<ImageBackground 
				source={require('../../assets/images/backgroundHeader.png')} 
				style={{
					height: hp('10%'),
					flexDirection: 'row',
					alignItems: 'center',
					paddingLeft: 20
				}}
			>
				<TouchableOpacity 
					style={{width: wp('7%')}} 
					onPress={() => props.navigation.goBack()}
				>
					<Icon name='ios-arrow-back' style={{color: '#FFF', fontSize: 25, marginTop: 20}} />
				</TouchableOpacity>
				<View>
					<Text style={[styles.text, {marginTop: 20, fontSize: 17}]}>Detail Order</Text>
					<Text style={styles.subtext}>{order.extid}</Text>
				</View>
			</ImageBackground>
			<ScrollView>
				<View style={{flex: 1, backgroundColor: '#FFF'}}>
					<View style={styles.list}>
						<Text style={styles.title}>Pengirim</Text>
						<Text style={styles.subtitle}>
							{capitalize(order.shippername)} ({capitalize(order.shipperaddress)}, {capitalize(order.shippersubdistrict)}, {capitalize(order.shippercity)}, {order.shipperzipcode})
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Penerima</Text>
						<Text style={styles.subtitle}>
							{capitalize(order.receivername)} ({capitalize(order.receiveraddress)}, {capitalize(order.receiversubdistrict)}, {capitalize(order.receivercity)}, {order.receiverzipcode})
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Kiriman {order.codvalue === 0 ? '' : 'COD'}</Text>
						<Text style={styles.subtitle}>
							{order.itemtypeid === 1 ? 'Paket' : 'Surat'} ({capitalize(order.desctrans)})
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Produk</Text>
						<Text style={styles.subtitle}>
							{capitalize(order.productname)}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Ongkir</Text>
						<Text style={styles.subtitle}>
							Rp {numberWithCommas(order.totalamount)}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Nilai Barang</Text>
						<Text style={styles.subtitle}>
							Rp {numberWithCommas(order.valuegoods)}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Nomor Pickup</Text>
						<Text style={styles.subtitle}>
							{order.pickupnumber === null ? '-' : order.pickupnumber}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Waktu Order</Text>
						<Text style={styles.subtitle}>
							{order.insert_date}
						</Text>
					</View>
					<View style={styles.list}>
						<Text style={styles.title}>Status Terakhir</Text>
						<Text style={styles.subtitle}>
							{order.laststatus}
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
} 

const styles = StyleSheet.create({
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	},
	subtext: {
		fontFamily: 'Nunito-semi',
		color: '#FFF',
		fontSize: 12
	},
	list: {
		height: hp('10%'),
		justifyContent: 'center',
		borderBottomWidth: 0.5,
		borderColor: rgba('#525252', 0.3),
		padding: 10
	},
	title: {
		fontFamily: 'Nunito-semi',
		fontSize: 15,
		color: '#525252'
	},
	subtitle: {
		fontFamily: 'Nunito-semi',
		fontSize: 14,
		color: rgba('#525252', 0.5)
	}
})

export default DetailOrder;