import React, { useState } from 'react';
import { 
	View, 
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

const RequestForm = props => {
	const [rekening, setRekening] = useState('');

	const handleSubmit = () => {
		if (!rekening) {
			alert('No rekening harap diisi');
		}else{
			props.onSubmit(rekening);
		}
	}

	return(
		<View style={styles.content}>
			<TextInput 
				style={styles.input}
				placeholder='Masukkan nomor rekening'
				keyboardType='number-pad'
				textAlign='center'
				value={rekening}
				onChangeText={(text) => setRekening(text)}

			/>
			<TouchableOpacity 
				style={styles.btn}
				activeOpacity={0.7}
				onPress={handleSubmit}
			>
				<Text style={styles.text}>Submit</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		height: hp('20%'),
		justifyContent: 'space-around'
	},
	input: {
		backgroundColor: 'white',
		width: wp('85%'),
		height: hp('6.7%'),
		borderRadius: 30
	},
	btn: {
		backgroundColor: '#ed9e0c',
		width: wp('85%'),
		height: hp('6.7%'),
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		color: '#FFF'
	}
})

RequestForm.propTypes = {
	onSubmit: PropTypes.func.isRequired
}

export default RequestForm;