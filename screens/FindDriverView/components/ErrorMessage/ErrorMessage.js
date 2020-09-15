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

const ErrorMessage = props => {
	return(
		<View style={styles.content}>
			<Text style={styles.text}>{props.text}</Text>
			<TouchableOpacity 
				style={styles.btn}
				onPress={props.onOrder}
				activeOpacity={0.7}
			>
				<Text style={styles.textBtn}>Coba lagi</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		textAlign: 'center',
		fontFamily: 'Nunito',
		fontSize: 16
	},
	btn: {
		backgroundColor: 'red',
		borderRadius: 30,
		width: wp('78%'),
		height: hp('6.7%'),
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10
	},
	textBtn: {
		color: '#FFF',
		fontFamily: 'Nunito-Bold',
		fontSize: 16
	}
})

export default ErrorMessage;