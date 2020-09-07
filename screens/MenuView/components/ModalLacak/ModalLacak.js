import React, { useEffect } from 'react';
import {
	View,
	Animated,
	TouchableOpacity,
	StatusBar,
	StyleSheet,
	Modal,
	TextInput
} from 'react-native';
import { Text } from 'native-base';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import PropTypes from 'prop-types';
import Hr from "react-native-hr-component";
import {
	widthPercentageToDP as wp, 
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'; 
import rgba from 'hex-to-rgba';
import api from '../../../../api';

const ListLacak = props => {
	return(
		<View style={{height: hp('7%'), justifyContent: 'center', alignItems: 'center'}}>
			<Text style={[styles.text, { textAlign: 'center'}]}>
				Tidak dapat memproses permintaan anda, silahkan coba beberapa saat lagi
			</Text>
		</View>
	);
}

const ModalToken = props => {
	const { value } = props;
	const [state, setState] = React.useState({
		bounceValue: new Animated.Value(200),
		active: 1,
		data: []
	})
	const [barcode, setBarcode] = React.useState('');

	const { bounceValue } = state;

	useEffect(() => {
		setAnimated();
	}, []);

	const handleSubmit = () => {
		if (!barcode) {
			alert('Barcode belum diisi');
		}else{
			setAnimated();
			setState(state => ({
				...state,
				active: 2,
				
			}))

			api.lacakKiriman(barcode)
				.then(tracks => {
					setState(state => ({
						...state,
						data: tracks
					}))
				});			
		}
	}

	const setAnimated = () => {
		bounceValue.setValue(200);
		Animated.spring(bounceValue, {
	      toValue: 0,
	      useNativeDriver: true,
	      tension: 2,
	      friction: 8
	    }).start();
	}

	return(
		<Modal
			transparent={true}
        	visible={true}
        	animationType="fade"
        	onRequestClose={props.onClose}
		>
			<StatusBar backgroundColor="rgba(0,0,0,0.5)"/>
			<View style={[styles.backgroundModal, { height: state.active ? null : hp('23%')}]}>
				<Animated.View style={[styles.modalContainer, {transform: [{translateY: bounceValue }] }]}>
					{ state.active === 1 ?  <React.Fragment>
						<View style={styles.inputGroup}>
							<TextInput 
								style={styles.input}
								placeholder='Masukkan kode barcode'
								returnKeyType='done'
								onChangeText={(text) => setBarcode(text)}
								value={barcode}
								onSubmitEditing={handleSubmit}
							/>
							<TouchableOpacity 
								style={styles.btn}
								onPress={handleSubmit}
							>
								<Feather name="search" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<Hr 
					    	lineColor={rgba('#737272', 0.4)}
					    	width={1} 
					    	textPadding={10} 
					    	text="atau" 
					    	textStyles={styles.hr} 
					    	hrPadding={10}
					    />
					    <TouchableOpacity 
							style={styles.btnDefault}
							//onPress={handleSubmit}
						>
							<Text style={[styles.text, { color: '#FFF'}]}>Scan barcode</Text>
						</TouchableOpacity>
					</React.Fragment> : <ListLacak /> }
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
		justifyContent: 'space-around'
	},
	text: {
		fontFamily: 'Nunito-Bold',
		fontSize: 14
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
	},
	btnDefault: {
		height: hp('6%'),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 25,
		backgroundColor: '#cc1e06'
	}
})

ModalToken.propTypes = {
	onClose: PropTypes.func.isRequired,
	// value: PropTypes.string.isRequired
}	

export default ModalToken;