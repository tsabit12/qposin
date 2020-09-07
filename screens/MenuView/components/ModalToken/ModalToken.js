import React, { useEffect } from 'react';
import {
	View,
	Animated,
	TouchableOpacity,
	StatusBar,
	StyleSheet,
	Modal
} from 'react-native';
import { ListItem, Body, Left, Right, Text } from 'native-base';
import { Entypo, Ionicons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import rgba from 'hex-to-rgba';

const ModalToken = props => {
	const { value } = props;
	const [state, setState] = React.useState({
		bounceValue: new Animated.Value(200)
	})

	const { bounceValue } = state;

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}, []);

	const handleClose = () => {
		Animated.spring(bounceValue, {
	      toValue: 100,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();

	    setTimeout(function() {
	    	props.onClose();
	    }, 10);
	}
	
	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
        	//onRequestClose={handleCloseModal}
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={styles.backgroundModal}>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
					<Text style={[styles.text, {textAlign: 'center', marginBottom: 2}]}>
						Untuk login di web QPOSin gunakan email kamu dengan password adalah ({props.value})
					</Text>
					<TouchableOpacity 
						style={[styles.btn]} 
						activeOpacity={0.7}
						onPress={handleClose}
					>
						<Text style={[styles.text, {color: '#FFF'}]}>Tutup</Text>
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
		height: hp('14%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
		fontSize: 14
	},
	btn: {
		backgroundColor: '#cc1e06',
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		borderRadius: 30
	}
})

ModalToken.propTypes = {
	onClose: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired
}	

export default ModalToken;