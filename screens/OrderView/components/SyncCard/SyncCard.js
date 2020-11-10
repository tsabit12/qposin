import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	container: {
		margin: 7,
		backgroundColor: '#FFF',
		elevation: 2,
		height: hp('7%'),
		alignItems: 'center',
		padding: 10,
		borderRadius: 3,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	label: {
		fontFamily: 'Nunito-semi'
	},
	btn: {
		//backgroundColor: 'red',
		height: hp('7%'),
		justifyContent: 'center',
		width: wp('7%'),
		alignItems: 'center'
	},
	icon: {
		color: '#2156d1'
	}
})

const SyncCard = props => {
	const { onPress } = props;
	return(
		<TouchableOpacity 
			style={styles.container} 
			activeOpacity={0.8}
			onPress={onPress}
		>
			<Text style={styles.label}>Aktifkan fitur COD</Text>
			<TouchableOpacity style={styles.btn} onPress={onPress}>
				<Octicons name="sync" size={24} style={styles.icon} />
			</TouchableOpacity>
		</TouchableOpacity>
	)
}

SyncCard.propTypes = {
	onPress: PropTypes.func.isRequired
}

export default SyncCard;