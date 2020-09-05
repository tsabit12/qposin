import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated } from 'react-native';
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
					<TouchableOpacity 
						style={styles.btn} 
						activeOpacity={0.7}
						onPress={() => props.onChoosed('1')}
					>
						<Text style={[styles.text, {color: '#FFF'}]}>PAKET</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.btn} 
						activeOpacity={0.7}
						onPress={() => props.onChoosed('2')}
					>
						<Text style={[styles.text, {color: '#FFF'}]}>SURAT</Text>
					</TouchableOpacity>
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
		height: hp('18%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		borderRadius: 30,
		marginTop: 10
	}
})

PilihJenis.propTypes = {
	handleClose: PropTypes.func.isRequired,
	onChoosed: PropTypes.func.isRequired
}

export default PilihJenis;