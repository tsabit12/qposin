import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import rgba from 'hex-to-rgba';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { EvilIcons } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		margin: 10,
		marginBottom: 15,
		backgroundColor: rgba('#454545', 1),
		height: hp('6%'),
		borderRadius: 6,
		alignItems: 'center',
		padding: 7,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	text: {
		color: '#FFF',
		fontSize: 15,
		flex: 1
	},
	btn: {
		//backgroundColor: 'red',
		height: hp('4%'),
		width: hp('4%'),
		borderRadius: hp('4%') / 2,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#f5e900',
		borderWidth: 2,
		marginLeft: 10
	}
})

const CustomToast = props => {
	const { open, message } = props;
	const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));

	useEffect(() => {
		if (open) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true
			}).start(() => {
				setTimeout(function() {
					props.onClose();
				}, 3000);
			});
		}else{
			setFadeAnim(new Animated.Value(0));
		}
	}, [open])

	if (open) {
		return(
			<Animated.View style={[styles.root, {opacity: fadeAnim}]}>
				<Text 
					style={styles.text}
					numberOfLines={1}
				>	
					{message ? message : 'Notification...'}
				</Text>
				<TouchableOpacity 
					style={styles.btn} 
					activeOpacity={0.6}
					onPress={() => {
						props.onClose()
					}}
				>
					<EvilIcons name="close" size={22} color="#f5e900" />
				</TouchableOpacity>
			</Animated.View>
		);
	}else{
		return null;
	}

}

CustomToast.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	message: PropTypes.string
}

export default CustomToast;