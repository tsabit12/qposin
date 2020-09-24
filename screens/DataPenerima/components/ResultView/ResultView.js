import React, { useState, useEffect } from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	Animated,
	StatusBar,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import PropTypes from 'prop-types';
import { Text as TextNote, CheckBox } from 'native-base';
import rgba from 'hex-to-rgba';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const rumusCod = (params, freeOngkir, freeBea) => {
	const result = {
		beaAdmin: 0,
		totalAll: 0
	}

	const defaultVal  = Number(params.nilai) * 0.01;

	if (params.isCod === '1') {
		if (!freeOngkir) { //uncheck free ongkir

			if (freeBea) {
				result.beaAdmin = 0;
				result.totalAll = Number(params.nilai) + Number(params.payloadTarif.tarif);  
			}else{
				var getCodVal 	= defaultVal <= 1500 ? 1500 : defaultVal;
			
				result.beaAdmin = getCodVal;
				result.totalAll = Number(getCodVal) + Number(params.nilai) + Number(params.payloadTarif.tarif); 
			}
		}else{
			if (freeBea) {
				result.beaAdmin = 0;
				result.totalAll = Number(params.nilai); 
			}else{
				var getCodVal 	= defaultVal <= 1500 ? 1500 : defaultVal;

				result.beaAdmin = getCodVal;
				result.totalAll = getCodVal + Number(params.nilai);
			}
		}
	}

	return result;
}

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ResultView = props => {

	const [state, setState] = useState({
		bounceValue: new Animated.Value(500),
		freeOngkir: true,
		freeBea: true
	})

	const { bounceValue } = state;
	const { pengirim, penerima, payloadTarif } = props.dataOrder;

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();

	}, [])

	const totalBayar = rumusCod(props.dataOrder, state.freeOngkir, state.freeBea);

	const handleOrder = () => {
		const payloadWsdl = {
		    "receivercustomertype":"1",
		    "itemtype":"1",
		    "type": props.dataOrder.isCod === '1' ? 'COD' : '',
		    "shipperzipcode": pengirim.kodepos,
		    "receiverzipcode": penerima.kodepos,
		    "serviceid": payloadTarif.id,
		    "shippersubsubdistrict": "0",
		    "shippersubdistrict": pengirim.kec,
		    "shippercity": pengirim.kota,
		    "shipperprovince": '-',
		    "shippercountry":"INDONESIA",
		    "receiversubsubdistrict": "0",
		    "receiversubdistrict": penerima.kec,
		    "receivercity": penerima.kota,
		    "receiverprovince": '-',
		    "receivercountry":"INDONESIA",
		    "weight": props.dataOrder.berat,
		    "fee": payloadTarif.beadasar,
		    "feetax": payloadTarif.ppn,
		    "insurance": payloadTarif.htnb,
		    "insurancetax": payloadTarif.ppnhtnb,
		    "valuegoods": props.dataOrder.nilai,
		    "desctrans": props.dataOrder.isikiriman,
		    "codvalue": totalBayar.totalAll,
		    "width": props.dataOrder.lebar ? props.dataOrder.lebar : '0',
		    "length": props.dataOrder.panjang ? props.dataOrder.panjang : '0',
		    "height": props.dataOrder.tinggi ? props.dataOrder.tinggi : '0',
		    "diagonal": 0,
		    "feeCod": totalBayar.beaAdmin
		};

		props.onOrder(payloadWsdl);
	}

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
        	onRequestClose={props.onClose}
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={styles.backgroundModal}>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
					<ScrollView>
						<View style={styles.list}>
							<Text style={styles.title}>Dari</Text>
							<TextNote note numberOfLines={1}>
								{capitalize(pengirim.kota)}, {pengirim.kec}, {pengirim.kodepos}
							</TextNote>
						</View>
						<View style={styles.list}>
							<Text style={styles.title}>Ke</Text>
							<TextNote note numberOfLines={1}>
								{capitalize(penerima.kota)}, {penerima.kec}, {penerima.kodepos}
							</TextNote>
						</View>
						<View style={styles.list}>
							<Text style={styles.title}>Layanan</Text>
							<TextNote note numberOfLines={1}>
								{payloadTarif.description}
							</TextNote>
						</View>
						<View style={styles.list}>
							<Text style={styles.title}>Kiriman</Text>
							<TextNote note numberOfLines={1}>
								{props.dataOrder.isikiriman} ({numberWithCommas(props.dataOrder.nilai)})
							</TextNote>
						</View>
						<View style={styles.list}>
							<Text style={styles.title}>COD</Text>
							<TextNote note numberOfLines={1}>
								{ props.dataOrder.isCod === '1' ? 'Ya' : 'Tidak' }
							</TextNote>
						</View>
						{ props.dataOrder.isCod === '1' ? 
						<React.Fragment>
							<View style={styles.list}>
								<Text style={styles.title}>Bea admin ditanggung seller</Text>
								<TouchableOpacity 
									style={styles.checkbox}
									onPress={() => setState(state => ({
										...state,
										freeBea: !state.freeBea
									}))}
								>
									<CheckBox 
										checked={state.freeBea} 
										color="green"
									/> 
									<TextNote note numberOfLines={1}>
										Ya
									</TextNote>
								</TouchableOpacity>
							</View> 
							<View style={styles.list}>
								<Text style={styles.title}>Ongkir ditanggung seller</Text>
								<TouchableOpacity 
									style={styles.checkbox}
									onPress={() => setState(state => ({
										...state,
										freeOngkir: !state.freeOngkir
									}))}
								>
									<CheckBox 
										checked={state.freeOngkir} 
										color="green"
									/> 
									<TextNote note numberOfLines={1}>
										Ya
									</TextNote>
								</TouchableOpacity>
							</View>
							<View style={[styles.list]}>
								<Text style={styles.title}>Ongkir</Text>
								<TextNote note numberOfLines={1}>
									Rp. {numberWithCommas(payloadTarif.tarif)}
								</TextNote>
							</View>
							<View style={[styles.list]}>
								<Text style={styles.title}>Nilai COD</Text>
								<TextNote note numberOfLines={1}>
									Rp. {numberWithCommas(totalBayar.totalAll)}
								</TextNote>
							</View>
						</React.Fragment> : <React.Fragment>
							<View style={[styles.list]}>
								<Text style={styles.title}>Ongkir</Text>
								<TextNote note numberOfLines={1}>
									Rp. {numberWithCommas(payloadTarif.tarif)}
								</TextNote>
							</View>
						</React.Fragment> }
						<View style={{justifyContent: 'center', alignItems: 'center'}}>
							<TouchableOpacity 
								style={styles.btn} activeOpacity={0.7}
								onPress={handleOrder}
							>
								<Text style={{fontFamily: 'Nunito-Bold', color: '#FFF'}}>
									Order 
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</Animated.View>
			</View>
		</Modal>
	);
}

ResultView.propTypes = {
	dataOrder: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
	onOrder: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	backgroundModal: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1
	},
	modalContainer: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		//padding: 10,
		//height: hp('74%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		height: hp('6%'),
		width: wp('70%'),
		borderRadius: 30,
		justifyContent: 'center',
		margin: 10
	},
	list: {
		//backgroundColor: 'red',
		padding: 10,
		borderBottomWidth: 0.3,
		height: hp('8%'),
		justifyContent: 'center',
		borderBottomColor: rgba('#8c8b8b',0.4)
	},
	title: {
		fontFamily: 'Nunito-Bold',
		fontSize: 15
	},
	checkbox: {
		flexDirection: 'row', 
		//backgroundColor: 'red', 
		width: wp('15%'),
		justifyContent: 'space-between',
		padding: 5,
		// marginLeft: -10
	}
})

export default ResultView;