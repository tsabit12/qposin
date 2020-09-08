import React, { useEffect } from 'react';
import { 
	Modal, 
	View, 
	Text, 
	TextInput, 
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
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const EntriBetay = props => {
	const bounceValue = new Animated.Value(200);
	const refInput = React.useRef();
	const [value, setValue] = React.useState('');

	useEffect(() => {
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();

	    setTimeout(function() {
	    	refInput.current.focus();
	    }, 10);
	}, []);

	const handleSubmit = () => {
		if (!value) {
			alert('Berat belum diisi')
		}else{
			
			Animated.spring(bounceValue, {
		      toValue: 100,
		      useNativeDriver: true,
		      tension: 2,
		      friction: 8
		    }).start();

		    setTimeout(function() {
		    	props.onChoosed(value);
		    }, 10);
		}
	}

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
					<Text style={styles.text}>Berat (gram)</Text>
					<View style={styles.inputGroup}>
						<TextInput 
							style={styles.input}
							ref={refInput}
							placeholder='Masukkan berat'
							returnKeyType='send'
							keyboardType='numeric'
							onChangeText={(text) => setValue(text)}
							value={value}
						/>
						<TouchableOpacity 
							style={styles.btn}
							onPress={handleSubmit}
						>
							<MaterialCommunityIcons name="send" size={24} color="black" />
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
		height: hp('13%')
	},
	text: {
		fontFamily: 'Nunito-Bold',
	},
	inputGroup: {
		flexDirection: 'row',
		// justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		marginTop: 5,
		borderWidth: 0.3,
		borderColor: '#737272'
	},
	btn: {
		alignItems: 'center',
		justifyContent: 'center',
		height: hp('6%'),
		flex: 1,
		borderTopRightRadius: 30,
		borderBottomRightRadius: 30
	},
	input: {
		height: hp('6%'),
		// backgroundColor: 'red',
		width: wp('85%'),
		paddingLeft: 10,
		borderTopLeftRadius: 30,
		borderBottomLeftRadius: 30,
	}
})

EntriBetay.propTypes = {
	handleClose: PropTypes.func.isRequired,
	onChoosed: PropTypes.func.isRequired
}

export default EntriBetay;