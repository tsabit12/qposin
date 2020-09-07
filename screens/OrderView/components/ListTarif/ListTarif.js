import React from 'react';
import { 
	View, 
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import rgba from 'hex-to-rgba';
import { Ionicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ListTarif = props => {
	const { data } = props;
	return(
		<View style={styles.root}>
			<View style={styles.border} />
			<View style={{margin: 10}}>
				<Text style={{color: '#ff8400'}}>Tarif</Text>
				{ data.map((row, index) => {
					const tarif 	= row.refTarif.split('|');
					let fee 		= Math.floor(tarif[0]);
					let ppn 		= Math.floor(tarif[1]);
					let htnb 		= Math.floor(tarif[2]);
					let ppnhtnb 	= Math.floor(tarif[3]);
					let totalTarif 	= Math.floor(tarif[4]);

					const payload = {
						id: row.id,
						description: row.name,
						tarif: totalTarif,
						beadasar: fee,
						ppn: ppn,
						htnb: htnb,
						ppnhtnb: ppnhtnb
					};

					return(
						<View style={styles.card} key={index}>
							<View style={styles.cardLeft}>
								<View style={[styles.group, {borderBottomWidth: 0.3}]}>
									<Text>Jasa</Text>
									<Text>Total</Text>
								</View>
								<View style={styles.group}>
									<Text 
										style={styles.orange}
										numberOfLines={1}
									>{row.name.split('(')[0].trim()} </Text>
									<Text style={styles.orange}>{numberWithCommas(totalTarif)}</Text>
								</View>
							</View>
							<TouchableOpacity 
								style={styles.cardRight}
								onPress={() => props.onChoose(payload)}
							>
								<Ionicons name="ios-arrow-forward" size={24} color="black" />
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		marginTop: 5
	},
	border: {
		width: wp('100%'),
		height: hp('0.1%'),
		backgroundColor: rgba('#FFF', 1),
		marginTop: 10,
		marginBottom: 5,
		elevation: 2
	},
	orange: {
		color:'#ff8400'
	},
	card: {
		flexDirection: 'row', 
		backgroundColor: 'white', 
		borderRadius: 10,
		elevation: 1,
		marginTop: 5
	},
	cardLeft: {
		//elevation: 1,
		width: wp('82%'),
		height: hp('10%'),
		//borderRadius: 20,
		justifyContent: 'space-around'
	},
	cardRight: {
		width: wp('14%'),
		justifyContent: 'center',
		alignItems: 'center'
	},
	group: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10
	}
})

ListTarif.propTypes = {
	data: PropTypes.array.isRequired,
	onChoose: PropTypes.func.isRequired
}

export default ListTarif;