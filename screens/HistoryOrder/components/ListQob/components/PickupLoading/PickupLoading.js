import React, { useState, useEffect } from 'react';
import { 
	View,
	Animated,
	Text,
	StyleSheet
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

const PickupLoading = props => {
	const [bounceValue] = useState(new Animated.Value(310));

	useEffect(() => {
		Animated.spring(bounceValue, {
			toValue: 0, 
			useNativeDriver: true,
			friction: 8
		}).start();
	}, []);

	const translateX = bounceValue;

	return(
		<Animated.View style={[styles.container, {transform: [{ translateX }] }]}>
			<Text style={styles.text}>{props.text ? props.text : 'Loading...'}</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: '#c91c0c',
		height: hp('5%'),
		justifyContent: 'center',
		padding: 10
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF',
		textAlign: 'center'
	}
})

PickupLoading.propTypes = {
	text: PropTypes.string
}

export default PickupLoading;