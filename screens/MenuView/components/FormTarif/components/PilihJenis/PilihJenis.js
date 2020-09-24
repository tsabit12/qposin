import React, { useEffect } from 'react';
import { 
	Modal, 
	View, 
	Text, 
	StyleSheet, 
	StatusBar, 
	TouchableOpacity,
	Animated 
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import PropTypes from 'prop-types';

const PilihJenis = props => {
	const bounceValue = new Animated.Value(200);

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}, []);

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
        	onRequestClose={props.handleClose}
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={styles.backgroundModal}>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
					<Text style={styles.text}>Pilih jenis kiriman</Text>
					<View style={styles.group}>
						<TouchableOpacity 
							style={[styles.btn, {borderTopLeftRadius: 30, borderBottomLeftRadius: 30}]} 
							activeOpacity={0.7}
							onPress={() => props.onChoosed('1')}
						>
							<Text style={[styles.text, {color: '#FFF'}]}>PAKET</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.btn, {borderTopRightRadius: 30, borderBottomRightRadius: 30}]} 
							activeOpacity={0.7}
							onPress={() => props.onChoosed('0')}
						>
							<Text style={[styles.text, {color: '#FFF'}]}>SURAT</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
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
		padding: 10,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		height: hp('14%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
		textAlign: 'center'
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		flex: 1,
		borderWidth: 0.3,
		borderColor: '#FFF'
	},
	group: {
		flexDirection: 'row',
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

PilihJenis.propTypes = {
	handleClose: PropTypes.func.isRequired,
	onChoosed: PropTypes.func.isRequired
}

export default PilihJenis;